import {IDevice} from './Device.interface';

export interface IGateway extends Document{
    readonly id: string;
    readonly name: string;
    readonly ipv4: string;
    readonly devices: IDevice[] | null;
}