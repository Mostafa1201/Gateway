import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IGateway } from 'src/interfaces/Gateway.interface';
import { CreateGatewayDto } from './dto/create-gateway.dto';
import { UpdateGatewayDto } from './dto/update-gateway.dto';
import { DeviceService } from '../device/device.service';
import { Gateway } from './entities/gateway.entity';

@Injectable()
export class GatewayService {
  constructor(
    @InjectModel(Gateway.name) private gatewayModel: Model<IGateway>,
    private readonly deviceService: DeviceService,
  ) {}

  async createGateway(createGatewayDto: CreateGatewayDto): Promise<IGateway> {
    const gateway = await new this.gatewayModel(createGatewayDto);
    return gateway.save();
  }

  async getAllGateways(): Promise<IGateway[]> {
    return await this.gatewayModel.find().populate('devices');
  }

  async getGateway(gatewayId: string): Promise<IGateway> {
    const gateway = await this.gatewayModel
      .findById(gatewayId)
      .populate('devices');
    if (!gateway) {
      throw new NotFoundException(`Gateway #${gatewayId} not found`);
    }
    return gateway;
  }

  async updateGateway(
    gatewayId: string,
    updateGatewayDto: UpdateGatewayDto,
  ): Promise<IGateway> {
    const gateway = await this.gatewayModel.findByIdAndUpdate(
      gatewayId,
      updateGatewayDto,
      { new: true },
    );
    if (!gateway) {
      throw new NotFoundException(`Gateway #${gatewayId} not found`);
    }
    return gateway;
  }

  async deleteGateway(gatewayId: string): Promise<IGateway> {
    const deletedGateway = await this.gatewayModel.findByIdAndDelete(gatewayId);

    if (!deletedGateway) {
      throw new NotFoundException(`Gateway #${gatewayId} not found`);
    }
    await this.deviceService.removeGatewayFromDevices(deletedGateway._id);
    return deletedGateway;
  }
}
