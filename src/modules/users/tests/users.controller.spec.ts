import config from "config/config";
import { Express } from "express";
import { setupServer } from "server/server";
import { disconnectAndClearDatabase } from "helpers/utils";
import http, { Server } from "http";
import ds from "infrastructure/orm/orm.config";
import supertest, { SuperAgentTest } from "supertest";
import { CreateUserDto } from "../dto/create-user.dto";
import { UsersService } from "../users.service";
import { Dependency } from "dependency";

describe("UsersController", () => {
  let app: Express;
  let agent: SuperAgentTest;
  let dependency: Dependency;
  let server: Server;

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
    agent = supertest.agent(app);

    usersService = dependency.getService(UsersService.name) as UsersService;
  });

  afterEach(async () => {
    await disconnectAndClearDatabase(ds);
  });

  describe("POST /users", () => {
    const createUserDto: CreateUserDto = { email: "user@test.com", password: "password", address: "1600 Amphitheatre Parkway, Mountain View, CA" };

    it("should create new user", async () => {
      const res = await agent.post("/api/v1/users").send(createUserDto);

      expect(res.statusCode).toBe(201);
      expect(res.body).toMatchObject({
        id: expect.any(String),
        email: expect.stringContaining(createUserDto.email) as string,
        address: expect.stringContaining(createUserDto.address) as string,
        coordinates: {
          lat: expect.any(String),
          lng: expect.any(String)
        },
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });

    it("should throw EntityAlreadyExistsError if user already exists", async () => {
      await usersService.createUser(createUserDto);

      const res = await agent.post("/api/v1/users").send(createUserDto);

      expect(res.statusCode).toBe(409);
      expect(res.body).toMatchObject({
        name: "EntityAlreadyExistsError",
        message: "A user for the email already exists",
      });
    });
  });
});
