import { AuthController } from "modules/auth/auth.controller";
import { AuthService } from "modules/auth/auth.service";
import { AccessToken } from "modules/auth/entities/access-token.entity";
import { Farm } from "modules/farms/entities/farm.entity";
import { FarmListService } from "modules/farms/farm-list.service";
import { FarmsController } from "modules/farms/farms.controller";
import { FarmsService } from "modules/farms/farms.service";
import FarmsRepository, { IFarmsRepository } from "modules/farms/repository/FarmsRepository";
import { User } from "modules/users/entities/user.entity";
import { UsersController } from "modules/users/users.controller";
import { UsersService } from "modules/users/users.service";
import { DataSource } from "typeorm";

export class Dependency {
  private constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private farmsService: FarmsService,
    private farmListService: FarmListService,
    private authController: AuthController,
    private usersController: UsersController,
    private farmsController: FarmsController,
  ) {}

  public static setupDependency(datasource: DataSource) {
    const farmsRepository = new FarmsRepository(datasource.getRepository(Farm));

    const usersService = new UsersService(datasource.getRepository(User));
    const authService = new AuthService(
      datasource.getRepository(AccessToken),
      usersService
    );
    const farmsService = new FarmsService(farmsRepository);
    const farmListService = new FarmListService(datasource.getRepository(Farm), usersService);

    const authController = new AuthController(authService);
    const usersController = new UsersController(usersService);
    const farmsController = new FarmsController(farmsService, farmListService);

    return new Dependency(
      authService,
      usersService,
      farmsService,
      farmListService,

      authController,
      usersController,
      farmsController
    );
  }
  
  public getService(serviceName: string) {
    switch (serviceName) {
      case AuthService.name: {
        return this.authService;
      }
      case UsersService.name: {
        return this.usersService;
      }
      case FarmsService.name: {
        return this.farmsService;
      }
      case FarmListService.name: {
        return this.farmListService;
      }
      default:
        throw new Error("Unrecognized service");
    }
  }

  public getController(controller: string) {
    switch (controller) {
      case AuthController.name: {
        return this.authController;
      }
      case UsersController.name: {
        return this.usersController;
      }
      case FarmsController.name: {
        return this.farmsController;
      }
      default:
        throw new Error("Unrecognized controller");
    }
  }
}
