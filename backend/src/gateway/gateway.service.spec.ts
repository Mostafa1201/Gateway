import { Test, TestingModule } from "@nestjs/testing";
import { MongoMemoryServer } from "mongodb-memory-server";
import { Connection, connect, Model } from "mongoose";
import { getModelToken } from "@nestjs/mongoose";
import { Gateway, GatewaySchema } from "./entities/gateway.entity";
import { GatewayService } from "./gateway.service";
import { INestApplication } from "@nestjs/common";
import { Device, DeviceSchema } from "../device/entities/device.entity";
import { DeviceService } from "../device/device.service";


describe("GatewayService", () => {
  let gatewayService: GatewayService;
  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;
  let gatewayModel: Model<Gateway>;
  let deviceModel: Model<Device>;
  let app: INestApplication;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    mongoConnection = (await connect(uri)).connection;
    gatewayModel = mongoConnection.model(Gateway.name, GatewaySchema);
    deviceModel = mongoConnection.model(Device.name, DeviceSchema);
    const testingModule: TestingModule = await Test.createTestingModule({
      providers: [
        GatewayService,
        {provide: getModelToken(Gateway.name), useValue: gatewayModel},
        DeviceService,
        {provide: getModelToken(Device.name), useValue: deviceModel},
      ],
    }).compile();
    app = testingModule.createNestApplication();
    await app.init();
    gatewayService = testingModule.get<GatewayService>(GatewayService);
  });

  afterAll(async () => {
    await mongoConnection.dropDatabase();
    await mongoConnection.close();
    await mongod.stop();
  });

  afterEach(async () => {
    const collections = mongoConnection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  });

  it('should be defined', () => {
    expect(gatewayService).toBeDefined();
  });


});
