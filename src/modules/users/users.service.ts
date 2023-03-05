import * as bcrypt from "bcrypt";
import config from "config/config";
import { EntityNotFoundError, UnprocessableEntityError } from "errors/errors";
import { DeepPartial, FindOptionsWhere, Repository } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { User } from "./entities/user.entity";

export class UsersService {
  constructor(private readonly usersRepository: Repository<User>) {
  }

  public async createUser(data: CreateUserDto): Promise<User> {
    const { email, password } = data;

    const existingUser = await this.findOneBy({ email: email });
    if (existingUser) throw new UnprocessableEntityError("A user for the email already exists");

    const hashedPassword = await this.hashPassword(password);

    const userData: DeepPartial<User> = { email, hashedPassword };

    const newUser = this.usersRepository.create(userData);
    return this.usersRepository.save(newUser);
  }

  public async findOneBy(param: FindOptionsWhere<User>): Promise<User> {
    const user = await this.usersRepository.findOneBy({ ...param });

    if (!user) {
      throw new EntityNotFoundError(`Couldn't find user ${JSON.stringify(param)}`)
    }

    return user
  }

  private async hashPassword(password: string, salt_rounds = config.SALT_ROUNDS): Promise<string> {
    const salt = await bcrypt.genSalt(salt_rounds);
    return bcrypt.hash(password, salt);
  }
}
