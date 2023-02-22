import { Test, TestingModule } from "@nestjs/testing";
import { MongoMemoryServer } from "mongodb-memory-server";
import { Connection, connect, Model } from "mongoose";
import { getModelToken } from "@nestjs/mongoose";
import { INestApplication, Res } from "@nestjs/common";
import { Device, DeviceSchema } from "../device/entities/device.entity";
import { DeviceService } from "../device/device.service";
import request from 'supertest';
import { DeviceController } from "./device.controller";
import { Constants } from "../utils/constants";

describe("DeviceController", () => {
  let deviceController: DeviceController;
  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;
  let deviceModel: Model<Device>;
  let app: INestApplication;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    mongoConnection = (await connect(uri)).connection;
    deviceModel = mongoConnection.model(Device.name, DeviceSchema);
    const testingModule: TestingModule = await Test.createTestingModule({
      controllers: [DeviceController],
      providers: [
        DeviceService,
        {provide: getModelToken(Device.name), useValue: deviceModel}
      ],
    }).compile();
    app = testingModule.createNestApplication();
    await app.init();
    deviceController = testingModule.get<DeviceController>(DeviceController);
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

  describe('Devices', () => {

    it('/device (GET)', async () => {
      const test = await request(app.getHttpServer())
        .get('/device')
        .expect(200)
        expect(test.body.devices).toBeDefined();
        expect(test.body.message).toBe(Constants.API_RESPONSE_MESSAGES.DEVICES_FOUND_SUCCESSFULLY);

    });

  });

});