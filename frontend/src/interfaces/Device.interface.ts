import {IGateway} from './Gateway.interface';

export interface IDevice {
    readonly uid: number;
    readonly vendor: string;
    readonly createdAt: Date;
    readonly status: string;
    readonly gateway: IGateway | string | null;
}