import { Controller, Get, Post, Body, Param, Delete, Res, HttpStatus, Put, UseInterceptors } from '@nestjs/common';
import { GatewayService } from './gateway.service';
import { CreateGatewayDto } from './dto/create-gateway.dto';
import { UpdateGatewayDto } from './dto/update-gateway.dto';
import { Constants } from "../utils/constants";

@Controller('gateway')
export class GatewayController {
  constructor(private readonly gatewayService: GatewayService) {}

  @Post()
   async createGateway(@Res() response, @Body() createGatewayDto: CreateGatewayDto) {
    try {
      const newGateway = await this.gatewayService.createGateway(createGatewayDto);
      return response.status(HttpStatus.CREATED).json({
        message: Constants.API_RESPONSE_MESSAGES.GATEWAY_CREATED_SUCCESSFULLY,
        newGateway
      });
    } 
    catch (err) {
      return response.status(err.status).json(err.response);
    }
  }
  
  @Put('/:id')
  async updateGateway(@Res() response,@Param('id') gatewayId: string,
  @Body() updateGatewayDto: UpdateGatewayDto) {
    try {
      const gateway = await this.gatewayService.updateGateway(gatewayId, updateGatewayDto);
      return response.status(HttpStatus.OK).json({
        message: Constants.API_RESPONSE_MESSAGES.GATEWAY_UPDATED_SUCCESSFULLY,
        gateway
      });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }

  @Get()
  async getGateways(@Res() response) {
    try {
      const gateways = await this.gatewayService.getAllGateways();
      return response.status(HttpStatus.OK).json({
        message: Constants.API_RESPONSE_MESSAGES.GATEWAYS_FOUND_SUCCESSFULLY,
        gateways
      });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }

  @Get('/:id')
  async getGateway(@Res() response, @Param('id') gatewayId: string) {
    try {
        const gateway = await this.gatewayService.getGateway(gatewayId);
        return response.status(HttpStatus.OK).json({
          message: Constants.API_RESPONSE_MESSAGES.GATEWAY_FOUND_SUCCESSFULLY,
          gateway
        });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }

  @Delete('/:id')
  async deleteGateway(@Res() response, @Param('id') gatewayId: string) {
    try {
      const deletedGateway = await this.gatewayService.deleteGateway(gatewayId);
      return response.status(HttpStatus.OK).json({
        message: Constants.API_RESPONSE_MESSAGES.GATEWAY_DELETED_SUCCESSFULLY,
        deletedGateway
      });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }
}
