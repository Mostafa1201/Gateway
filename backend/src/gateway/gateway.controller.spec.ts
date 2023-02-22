import { Test, TestingModule } from "@nestjs/testing";
import { MongoMemoryServer } from "mongodb-memory-server";
import { Connection, connect, Model } from "mongoose";
import { getModelToken } from "@nestjs/mongoose";
import { GatewayController } from "./gateway.controller";
import { Gateway, GatewaySchema } from "./entities/gateway.entity";
import { GatewayService } from "./gateway.service";
import { INestApplication, Res, ValidationPipe } from "@nestjs/common";
import { Device, DeviceSchema } from "../device/entities/device.entity";
import { DeviceService } from "../device/device.service";
import request from 'supertest';
import { Constants } from "../utils/constants";


describe("GatewayController", () => {
  let gatewayController: GatewayController;
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
      controllers: [GatewayController],
      providers: [
        GatewayService,
        {provide: getModelToken(Gateway.name), useValue: gatewayModel},
        DeviceService,
        {provide: getModelToken(Device.name), useValue: deviceModel},
      ],
    }).compile();
    app = testingModule.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true }))
    await app.init();
    gatewayController = testingModule.get<GatewayController>(GatewayController);
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
  
  describe('Gateways', () => {

    it("should fail to save the gateway because of invalid ipv4", async () => {
      await request(app.getHttpServer())
        .post('/gateway')
        .send({name: 'Gateway 1',ipv4: '23193013.168.1.1'})
        .expect(400)
    });

    it("should save the gateway successfully", async () => {
      await request(app.getHttpServer())
        .post('/gateway')
        .send({name: 'Gateway 2',ipv4: '192.168.1.1'})
        .expect(201)
    });

    it('/gateway (GET)', async () => {
      const test = await request(app.getHttpServer())
        .get('/gateway')
        .expect(200)

        expect(test.body.gateways).toBeDefined();
        expect(test.body.message).toBe(Constants.API_RESPONSE_MESSAGES.GATEWAYS_FOUND_SUCCESSFULLY);

    });

  });

});