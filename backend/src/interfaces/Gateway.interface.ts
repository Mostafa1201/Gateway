import { Document } from 'mongoose';
import { Device } from 'src/device/entities/device.entity';
export interface IGateway extends Document{
    id: string;
    name: string;
    ipv4: string;
    devices: Device[];
}