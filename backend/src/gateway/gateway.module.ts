import { Module } from '@nestjs/common';
import { GatewayService } from './gateway.service';
import { GatewayController } from './gateway.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Gateway, GatewaySchema } from './entities/gateway.entity';
import { DeviceModule } from '../device/device.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Gateway.name, schema: GatewaySchema }]),
    DeviceModule,
  ],
  controllers: [GatewayController],
  providers: [GatewayService],
})
export class GatewayModule {}
