import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform, Type } from 'class-transformer';
import { ObjectId } from 'mongoose';
import { Device } from '../../device/entities/device.entity';

@Schema({
  timestamps: true,
  toJSON: {
    getters: true,
    virtuals: true,
  },
})
export class Gateway {
  @Transform(({ value }) => value.toString())
  _id: ObjectId | string;

  @Prop()
  name: string;

  @Prop()
  ipv4: string;

  @Type(() => Device)
  devices: Device[];
}
const GatewaySchema = SchemaFactory.createForClass(Gateway);

GatewaySchema.virtual('devices', {
  ref: 'Device',
  localField: '_id',
  foreignField: 'gateway',
});

export { GatewaySchema };
