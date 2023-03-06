import config from "config/config";
import { EntityAlreadyExistsError } from "errors/errors";
import { Express } from "express";
import { setupServer } from "server/server";
import { disconnectAndClearDatabase } from "helpers/utils";
import http, { Server } from "http";
import ds from "infrastructure/orm/orm.config";
import { CreateUserDto } from "../dto/create-user.dto";
import { User } from "../entities/user.entity";
import { UsersService } from "../users.service";
import { Dependency } from "dependency";

jest.setTimeout(10000);

describe("UsersService", () => {
  let app: Express;
  let server: Server;
  let dependency: Dependency;

  let usersService: UsersService;

  beforeAll(() => {
    dependency = Dependency.setupDependency(ds);
    app = setupServer(dependency);
    server = http.createServer(app).listen(config.APP_PORT);
  });

  afterAll(() => {
    server.close();
  });

  beforeEach(async () => {
    await ds.initialize();
    usersService = dependency.getService(UsersService.name) as UsersService;
  });

  afterEach(async () => {
    await disconnectAndClearDatabase(ds);
  });

  describe(".createUser", () => {
    const createUserDto: CreateUserDto = { 
      email: "user@test.com",
      password: "password",
      address: {
        countryCode: "US",
        city: "Chesterfield",
        addressLine: "7836 Winding Ash Rd"
      } 
    };

    it("should create new user", async () => {
      const createdUser = await usersService.createUser(createUserDto);
      expect(createdUser).toBeInstanceOf(User);
    });

    describe("with existing user", () => {
      beforeEach(async () => {
        await usersService.createUser(createUserDto);
      });

      it("should throw UnprocessableEntityError if user already exists", async () => {
        await usersService.createUser(createUserDto).catch((error: EntityAlreadyExistsError) => {
          expect(error).toBeInstanceOf(EntityAlreadyExistsError);
          expect(error.message).toBe("A user for the email already exists");
        });
      });
    });
  });

  describe(".findOneBy", () => {
    const createUserDto: CreateUserDto = { 
      email: "user@test.com",
      password: "password",
      address: {
        countryCode: "US",
        city: "Chesterfield",
        addressLine: "7836 Winding Ash Rd"
      } 
    };

    it("should get user by provided param", async () => {
      const user = await usersService.createUser(createUserDto);
      const foundUser = await usersService.findOneBy({ email: user.email });

      expect(foundUser).toMatchObject({ ...user });
    });

    it("should return null if user not found by provided param", async () => {
      const foundUser = await usersService.findOneBy({ email: "notFound@mail.com" });
      expect(foundUser).toBeNull();
    });
  });
});
