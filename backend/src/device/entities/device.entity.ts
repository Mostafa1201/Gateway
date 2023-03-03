import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform, Type } from 'class-transformer';
import { ObjectId, Types } from 'mongoose';
import { Gateway } from '../../gateway/entities/gateway.entity';

@Schema()
export class Device {
  @Transform(({ value }) => value.toString())
  _id: ObjectId;

  @Prop()
  uid: number;

  @Prop()
  vendor: string;

  @Prop()
  dateCreated: Date;

  @Prop()
  status: string;

  @Prop({ type: Types.ObjectId, ref: 'Gateway' })
  @Type(() => Gateway)
  gateway: Gateway;
}

export const DeviceSchema = SchemaFactory.createForClass(Device);
