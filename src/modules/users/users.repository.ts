import { DeepPartial, FindOptionsWhere, Repository } from "typeorm";
import { User } from "./entities/user.entity";


export interface IUsersRepository {
  getUser(param: FindOptionsWhere<User>): Promise<User | null>
  save(user: DeepPartial<User>): Promise<User>;
}

export default class UsersRepository implements IUsersRepository {
  constructor(
    private usersRepository: Repository<User>
  ) {}

  public getUser(param: FindOptionsWhere<User>): Promise<User | null> {
    return this.usersRepository.findOneBy({ ...param });
  }

  public save(user: DeepPartial<User>): Promise<User> {
    const newUser = this.usersRepository.create(user);
    return this.usersRepository.save(newUser);
  }
}
