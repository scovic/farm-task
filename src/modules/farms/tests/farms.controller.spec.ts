import config from "config/config";
import { Express } from "express";
import { setupServer } from "server/server";
import http, { Server } from "http";
import { Dependency } from "dependency";
import ds from "infrastructure/orm/orm.config";
import supertest, { SuperAgentTest } from "supertest";
import { disconnectAndClearDatabase } from "helpers/utils";
import { CreateFarmDto } from "../dto/create-farm.dto";
import { CreateUserDto } from "modules/users/dto/create-user.dto";
import { AuthService } from "modules/auth/auth.service";
import { FarmsService } from "../farms.service";
import { UsersService } from "modules/users/users.service";
// import { FarmListService } from "../farm-list.service";

jest.setTimeout(40000);

describe("FarmsController", () => {
  let app: Express;
  let agent: SuperAgentTest;
  let dependency: Dependency;
  let server: Server;

  let farmsService: FarmsService;
  // let farmListService: FarmListService;
  let usersService: UsersService;
  let authService: AuthService;

  beforeAll(() => {
    dependency = Dependency.setupDependency(ds);
    app = setupServer(dependency);
    server = http.createServer(app).listen(config.APP_PORT);
  })

  afterAll(() => {
    server.close();
  })

  beforeEach(async () => {
    await ds.initialize();
    agent = supertest.agent(app);

    usersService = dependency.getService(UsersService.name) as UsersService;
    farmsService = dependency.getService(FarmsService.name) as FarmsService;
    // farmListService = dependency.getService(FarmListService.name) as FarmListService;
    authService = dependency.getService(AuthService.name) as AuthService;
  })

  afterEach(async () => {
    await disconnectAndClearDatabase(ds);
  });

  describe("POST /farms", () => {
    const createUserDto: CreateUserDto = { 
      email: "user@test.com",
      password: "password",
      address: {
        countryCode: "US",
        city: "Chesterfield",
        addressLine: "7836 Winding Ash Rd"
      } 
    };

    const createFarmDto: CreateFarmDto = {
      address: {
        addressLine: "170 N 100th E",
        city: "Manti",
        countryCode: "US"
      },
      name: "farm",
      size: 20.3,
      userId: "",
      yieldValue: 14.2
    }

    it("should create new farm", async () => {
      const user = await usersService.createUser(createUserDto);
      createFarmDto.userId = user.id;
      const accessToken = await authService.login({ email: createUserDto.email, password: createUserDto.password });

      const res = await agent.post("/api/v1/farms")
        .set("Authorization", `Bearer ${accessToken.token}`)
        .send(createFarmDto);

      expect(res.statusCode).toBe(201);
      expect(res.body).toMatchObject({
        id: expect.any(String),
        userId: user.id,
        name: expect.any(String),
        address: createFarmDto.address,
        coordinates: {
          lat: expect.any(String),
          lng: expect.any(String)
        },
        size: expect.any(Number),
        yieldValue: expect.any(Number),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      })
    })
  })

  describe("DELETE /farms/:id", () => {
    const createUserDto: CreateUserDto = { 
      email: "user@test.com",
      password: "password",
      address: {
        countryCode: "US",
        city: "Chesterfield",
        addressLine: "7836 Winding Ash Rd"
      } 
    };

    const createFarmDto: CreateFarmDto = {
      address: {
        addressLine: "170 N 100th E",
        city: "Manti",
        countryCode: "US"
      },
      name: "farm",
      size: 20.3,
      userId: "",
      yieldValue: 14.2
    }

    it("should delete existing farm", async () => {
      const user = await usersService.createUser(createUserDto);
      createFarmDto.userId = user.id;
      const accessToken = await authService.login({ email: createUserDto.email, password: createUserDto.password });
      const createdFarm = await farmsService.createFarm(createFarmDto);

      const res = await agent.delete(`/api/v1/farms/${createdFarm.id}`)
        .set("Authorization", `Bearer ${accessToken.token}`)
        .send();

      expect(res.statusCode).toBe(204);
    })

    it("should return 204 when deleting a farm that doesn't exists", async () => {
      await usersService.createUser(createUserDto);
      const accessToken = await authService.login({ email: createUserDto.email, password: createUserDto.password });

      const res = await agent.delete(`/api/v1/farms/178f8d94-5253-431c-835b-2b4a1904f50f`)
        .set("Authorization", `Bearer ${accessToken.token}`)
        .send();

      expect(res.statusCode).toBe(204);
    })

    it("should throw an OperationNotPermittedError error if trying to delete someone elses farm", async () => {
      await usersService.createUser(createUserDto);
      const accessToken = await authService.login({ email: createUserDto.email, password: createUserDto.password });
      const createFarmDto1: CreateFarmDto = {
        ...createFarmDto,
        userId: "178f8d94-5253-431c-835b-2b4a1904f50f"
      }
      const createdFarm = await farmsService.createFarm(createFarmDto1);

      const res = await agent.delete(`/api/v1/farms/${createdFarm.id}`)
        .set("Authorization", `Bearer ${accessToken.token}`)
        .send();

      expect(res.statusCode).toBe(403);
    })
  })

  describe("GET /farms", () => {
    const createUserDto: CreateUserDto = { 
      email: "user@test.com",
      password: "password",
      address: {
        countryCode: "US",
        city: "Chesterfield",
        addressLine: "7836 Winding Ash Rd"
      } 
    };

    const createFarmDto1: CreateFarmDto = {
      address: {
        addressLine: "170 N 100th E",
        city: "Manti",
        countryCode: "US"
      },
      name: "b farm",
      size: 20.3,
      userId: "",
      yieldValue: 14.2
    }

    const createFarmDto2: CreateFarmDto = {
      address: {
        addressLine: "8091 Spruce Trl",
        city: "Eden Prairie",
        countryCode: "US"
      },
      name: "a farm",
      size: 14.3,
      userId: "",
      yieldValue: 7.2
    }

    it("should get all farms", async () => {
      const user = await usersService.createUser(createUserDto);
      createFarmDto1.userId = user.id;
      createFarmDto2.userId = user.id;

      await Promise.all([
        farmsService.createFarm(createFarmDto1),
        farmsService.createFarm(createFarmDto2)
      ]);

      const accessToken = await authService.login({ email: createUserDto.email, password: createUserDto.password });

      const res = await agent.get(`/api/v1/farms`)
        .set("Authorization", `Bearer ${accessToken.token}`)
        .send();

      expect(res.status).toBe(200);
      expect(res.body.farms.length).toBe(2)
    })

    it("should get all farms sorted by name", async () => {
      const user = await usersService.createUser(createUserDto);
      createFarmDto1.userId = user.id;
      createFarmDto2.userId = user.id;

      await Promise.all([
        farmsService.createFarm(createFarmDto1),
        farmsService.createFarm(createFarmDto2)
      ]);

      const accessToken = await authService.login({ email: createUserDto.email, password: createUserDto.password });

      const res = await agent.get(`/api/v1/farms?sort=name`)
        .set("Authorization", `Bearer ${accessToken.token}`)
        .send();

      expect(res.status).toBe(200);
      expect(res.body.farms.length).toBe(2)
      expect(res.body.farms).toMatchObject([{
        name: "a farm",
      },
      {
        name: "b farm"
      }])
    })

    it("should get all farms sorted by date of creation", async () => {
      const user = await usersService.createUser(createUserDto);
      createFarmDto1.userId = user.id;
      createFarmDto2.userId = user.id;

      await farmsService.createFarm(createFarmDto1)
      await farmsService.createFarm(createFarmDto2)

      const accessToken = await authService.login({ email: createUserDto.email, password: createUserDto.password });

      const res = await agent.get(`/api/v1/farms?sort=date`)
        .set("Authorization", `Bearer ${accessToken.token}`)
        .send();

      expect(res.status).toBe(200);
      expect(res.body.farms.length).toBe(2)
      expect(res.body.farms).toMatchObject([{
        name: "a farm",
      },
      {
        name: "b farm"
      }])
    })

    it("should get all farms with outliers filter", async () => {
      const user = await usersService.createUser(createUserDto);
      createFarmDto1.userId = user.id;
      createFarmDto2.userId = user.id;

      await farmsService.createFarm(createFarmDto1)
      await farmsService.createFarm(createFarmDto2)

      const accessToken = await authService.login({ email: createUserDto.email, password: createUserDto.password });

      const res = await agent.get(`/api/v1/farms?outliers=true`)
        .set("Authorization", `Bearer ${accessToken.token}`)
        .send();

      expect(res.status).toBe(200);
      expect(res.body.farms.length).toBe(0);
    })
  })
})
