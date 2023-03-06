/* eslint-disable @typescript-eslint/no-unsafe-call */
import * as bcrypt from "bcrypt";
import config from "config/config";
import { EntityAlreadyExistsError } from "errors/errors";
import { GeoService } from "modules/geo/geo.service";
import { DeepPartial, FindOptionsWhere } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { User } from "./entities/user.entity";
import { IUsersRepository } from "./users.repository";

export class UsersService {
  constructor(
    private readonly usersRepository: IUsersRepository,
    private readonly geoService: GeoService
  ) { }

  public async createUser(data: CreateUserDto): Promise<User> {
    const { email, password, address } = data;

    const existingUser = await this.findOneBy({ email: email });
    if (existingUser) throw new EntityAlreadyExistsError("A user for the email already exists");

    const [hashedPassword, coordinates] = await Promise.all([
      this.hashPassword(password),
      this.geoService.getAddressCoordinates(address)
    ]);

    const userData: DeepPartial<User> = { email, hashedPassword, address, coordinates };

    return this.usersRepository.save(userData);
  }

  public async findOneBy(param: FindOptionsWhere<User>): Promise<User | null> {
    return this.usersRepository.getUser({ ...param });
  }

  private async hashPassword(password: string, salt_rounds = config.SALT_ROUNDS): Promise<string> {
    const salt = await bcrypt.genSalt(salt_rounds);
    return bcrypt.hash(password, salt);
  }
}
