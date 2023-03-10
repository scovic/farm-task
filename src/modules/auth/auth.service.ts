import * as bcrypt from "bcrypt";
import config from "config/config";
import { fromUnixTime } from "date-fns";
import { EntityNotFoundError, UnprocessableEntityError } from "errors/errors";
import { decode, sign, verify } from "jsonwebtoken";
import { UsersService } from "modules/users/users.service";
import { Repository } from "typeorm";
import { LoginUserDto } from "./dto/login-user.dto";
import { AccessToken } from "./entities/access-token.entity";
import { User } from "modules/users/entities/user.entity";

export class AuthService {
  constructor(
    private readonly accessTokenRepository: Repository<AccessToken>,
    private readonly usersService: UsersService
  ) { }

  public async getAccessToken(token: string): Promise<AccessToken | null> {
    return this.accessTokenRepository.findOne({ where: { token }, relations: ["user"]});
  }

  public async login(data: LoginUserDto): Promise<AccessToken> {
    const user = await this.usersService.findOneBy({ email: data.email });

    if (!user) throw new UnprocessableEntityError("Invalid user email or password");

    const isValidPassword = await this.validatePassword(data.password, user.hashedPassword);

    if (!isValidPassword) throw new UnprocessableEntityError("Invalid user email or password");

    const token = sign(
      {
        id: user.id,
        email: user.email,
      },
      config.JWT_SECRET,
      { expiresIn: config.JWT_EXPIRES_AT },
    );
    const tokenExpireDate = this.getJwtTokenExpireDate(token);

    const newToken = this.accessTokenRepository.create({
      token,
      user,
      expiresAt: fromUnixTime(tokenExpireDate),
    });

    return this.accessTokenRepository.save(newToken);
  }

  public async getUserFromJwtToken(token: string): Promise<User> {
    const { id } = decode(token) as { [id: string]: string };
    const user = await this.usersService.findOneBy({ id });

    if (!user) {
      throw new EntityNotFoundError(`User doens't exists (id ${id})`)
    }

    return user
  }

  public isJwtTokenValid(token: string): boolean {
    try {
      verify(token, config.JWT_SECRET);
    } catch (err) {
      return false;
    }

    const tokenExpireDate = this.getJwtTokenExpireDate(token);
    return tokenExpireDate * 1000 > Date.now();
  }

  private getJwtTokenExpireDate(token: string): number {
    const { exp } = decode(token) as { [exp: string]: number };
    return exp;
  }

  private async validatePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}
