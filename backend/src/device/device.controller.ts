import { Controller, Get, Post, Body,Param, Delete, Res, HttpStatus, Put } from '@nestjs/common';
import { Constants } from "../utils/constants";
import { DeviceService } from './device.service';
import { AddDeviceToGatewayDTO } from './dto/add-device-to-gateway.dto';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';

@Controller('device')
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}

  @Post()
   async createDevice(@Res() response, @Body() createDeviceDto: CreateDeviceDto) {
    try {
      const newDevice = await this.deviceService.createDevice(createDeviceDto);
      return response.status(HttpStatus.CREATED).json({
        message: Constants.API_RESPONSE_MESSAGES.DEVICE_CREATED_SUCCESSFULLY,
        newDevice
      });
    } 
    catch (err) {
      return response.status(err.status).json(err.response);
    }
  }
  
  @Put('/:id')
  async updateDevice(@Res() response,@Param('id') deviceId: string,
  @Body() updateDeviceDto: UpdateDeviceDto) {
    try {
      const device = await this.deviceService.updateDevice(deviceId, updateDeviceDto);
      return response.status(HttpStatus.OK).json({
        message: Constants.API_RESPONSE_MESSAGES.DEVICE_UPDATED_SUCCESSFULLY,
        device
      });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }

  @Get()
  async getDevices(@Res() response) {
    try {
      const devices = await this.deviceService.getAllDevices();
      return response.status(HttpStatus.OK).json({
        message: Constants.API_RESPONSE_MESSAGES.DEVICES_FOUND_SUCCESSFULLY,
        devices
      });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }

  @Get('/data/:id')
  async getDevice(@Res() response, @Param('id') deviceId: string) {
    try {
        const device = await this.deviceService.getDevice(deviceId);
        return response.status(HttpStatus.OK).json({
          message: Constants.API_RESPONSE_MESSAGES.DEVICE_FOUND_SUCCESSFULLY,
          device
        });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }

  @Post('/addToGateway')
   async addDeviceToGateway(@Res() response, @Body() addDeviceToGatewayDTO: AddDeviceToGatewayDTO) {
    try {
      await this.deviceService.addDeviceToGateway(addDeviceToGatewayDTO);
      return response.status(HttpStatus.OK).json({
        message: Constants.API_RESPONSE_MESSAGES.DEVICE_ADDED_TO_GATEWAY
      });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }

  @Delete('/:deviceId/gateway/:gatewayId')
  async removeDeviceFromGateway(@Res() response, @Param('gatewayId') gatewayId: string , @Param('deviceId') deviceId: string) {
    try {
      const device = await this.deviceService.removeDeviceFromGateway(gatewayId,deviceId);
      return response.status(HttpStatus.OK).json({
        message: Constants.API_RESPONSE_MESSAGES.DEVICE_REMOVED_FROM_GATEWAY,
        device
      });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }

  @Get('/unconnectedDevices')
  async getUnConnectedDevices(@Res() response) {
    try {
      const devices = await this.deviceService.getUnConnectedDevices();      
      return response.status(HttpStatus.OK).json({
        message: Constants.API_RESPONSE_MESSAGES.DEVICES_FOUND_SUCCESSFULLY,
        devices
      });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }
}
