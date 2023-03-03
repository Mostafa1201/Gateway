import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IDevice } from '../../src/interfaces/Device.interface';
import { Constants } from '../utils/constants';
import { AddDeviceToGatewayDTO } from './dto/add-device-to-gateway.dto';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
const mongoose = require('mongoose');
const CustomError = require('../handlers/customError');

@Injectable()
export class DeviceService {
  constructor(@InjectModel('Device') private deviceModel: Model<IDevice>) {}

  async createDevice(createdeviceDto: CreateDeviceDto) {
    const { vendor, status } = createdeviceDto;
    const generatedDeviceId = await this.generateNewDeviceId();
    const device = await new this.deviceModel({
      gateway: null,
      vendor,
      status,
      uid: generatedDeviceId,
      createdAt: new Date(),
    });
    return device.save();
  }

  async addDeviceToGateway(
    addDeviceToGatewayDTO: AddDeviceToGatewayDTO,
  ): Promise<boolean> {
    const { deviceId, gatewayId } = addDeviceToGatewayDTO;
    const devicesCount = await this.getGatewayDevicesCount(gatewayId);
    if (devicesCount >= 10) {
      throw new CustomError(
        Constants.API_RESPONSE_MESSAGES.LIMIT_EXCEEDED_MESSAGE,
        400,
        Constants.API_RESPONSE_MESSAGES.LIMIT_EXCEEDED,
      );
    }

    const device = await this.deviceModel.findOne({
      _id: mongoose.Types.ObjectId(deviceId),
      gateway: mongoose.Types.ObjectId(gatewayId),
    });

    if (device) {
      throw new CustomError(
        `Device #${deviceId} is already connected to gateway #${gatewayId}`,
        400,
        'Already Found',
      );
    }

    const deviceUpdated = await this.deviceModel.updateOne(
      {
        _id: mongoose.Types.ObjectId(deviceId),
      },
      { $set: { gateway: mongoose.Types.ObjectId(gatewayId) } },
    );
    if (!deviceUpdated) {
      throw new NotFoundException(
        Constants.API_RESPONSE_MESSAGES.ERROR_ASSINING_DEVICE,
      );
    }
    return true;
  }

  async getAllDevices(): Promise<IDevice[]> {
    return await this.deviceModel.find();
  }

  async getDevice(deviceId: string): Promise<IDevice> {
    const device = await this.deviceModel.findById(deviceId).exec();
    if (!device) {
      throw new NotFoundException(`Device #${deviceId} not found`);
    }
    return device;
  }

  async updateDevice(
    deviceId: string,
    updateDeviceDto: UpdateDeviceDto,
  ): Promise<IDevice> {
    const device = await this.deviceModel.findByIdAndUpdate(
      deviceId,
      updateDeviceDto,
      { new: true },
    );
    if (!device) {
      throw new NotFoundException(`Device #${deviceId} not found`);
    }
    return device;
  }

  async removeDeviceFromGateway(
    gatewayId: string,
    deviceId: string,
  ): Promise<any> {
    const device = await this.deviceModel.findOneAndUpdate(
      {
        gateway: mongoose.Types.ObjectId(gatewayId),
        _id: mongoose.Types.ObjectId(deviceId),
      },
      { $set: { gateway: null } },
    );
    if (!device) {
      throw new NotFoundException(
        `Device #${deviceId} not found in gateway #${gatewayId}`,
      );
    }
    delete device.gateway;
    return device;
  }

  async generateNewDeviceId(): Promise<number> {
    const lastDevice = await this.deviceModel
      .findOne()
      .sort({ uid: 'desc' })
      .limit(1);
    const newID = lastDevice ? lastDevice.uid + 1 : 1;
    return newID;
  }

  async getGatewayDevicesCount(gatewayId: string): Promise<number> {
    return await this.deviceModel.countDocuments({
      gateway: mongoose.Types.ObjectId(gatewayId),
    });
  }

  async removeGatewayFromDevices(gatewayId: string): Promise<any> {
    return await this.deviceModel.updateMany(
      { gateway: mongoose.Types.ObjectId(gatewayId) },
      { $set: { gateway: null } },
    );
  }

  async getUnConnectedDevices(): Promise<IDevice[]> {
    return await this.deviceModel.find({ gateway: null });
  }
}
