import { Test, TestingModule } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Connection, connect, Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { INestApplication } from '@nestjs/common';
import { Device, DeviceSchema } from '../device/entities/device.entity';
import { DeviceService } from '../device/device.service';
import { GatewayService } from '../gateway/gateway.service';
import { Gateway, GatewaySchema } from '../gateway/entities/gateway.entity';

describe('DeviceService', () => {
  let gatewayService: GatewayService;
  let deviceService: DeviceService;
  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;
  let gatewayModel: Model<Gateway>;
  let deviceModel: Model<Device>;
  let app: INestApplication;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    mongoConnection = (await connect(uri)).connection;
    deviceModel = mongoConnection.model(Device.name, DeviceSchema);
    gatewayModel = mongoConnection.model(Gateway.name, GatewaySchema);
    const testingModule: TestingModule = await Test.createTestingModule({
      providers: [
        GatewayService,
        { provide: getModelToken(Gateway.name), useValue: gatewayModel },
        DeviceService,
        { provide: getModelToken(Device.name), useValue: deviceModel },
      ],
    }).compile();
    app = testingModule.createNestApplication();
    await app.init();
    gatewayService = testingModule.get<GatewayService>(GatewayService);
    deviceService = testingModule.get<DeviceService>(DeviceService);
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
    expect(deviceService).toBeDefined();
  });

  describe('create a device', () => {
    it('should create a device successfully', async () => {
      const gateway = await gatewayService.createGateway({
        name: 'Gateway 1',
        ipv4: '192.168.1.1',
      });
      const device = await deviceService.createDevice({
        vendor: `Device #0`,
        status: 'online',
      });
      await deviceService.addDeviceToGateway({
        deviceId: device._id,
        gatewayId: gateway._id,
      });
      expect(200);
    });

    it('should fail to create a device - limit exceeded', async () => {
      try {
        const gateway = await gatewayService.createGateway({
          name: 'Gateway 2',
          ipv4: '192.168.1.2',
        });
        for (let i = 0; i < 20; i++) {
          const device = await deviceService.createDevice({
            vendor: `Device #${i + 1}`,
            status: 'online',
          });
          await deviceService.addDeviceToGateway({
            deviceId: device._id,
            gatewayId: gateway._id,
          });
        }
        expect(true).toBe(false);
      } catch (error) {
        expect(error.message).toBe(
          'Device limit exceeded , Only 10 peripheral devices are allowed for a gateway',
        );
      }
    });
  });
});
