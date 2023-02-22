import { Document } from 'mongoose';
import { Gateway } from 'src/gateway/entities/gateway.entity';
export interface IDevice extends Document{
    uid: number;
    vendor: string;
    createdAt: Date;
    status: string;
    gateway ?: Gateway | string;
}