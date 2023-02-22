import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class AddDeviceToGatewayDTO {
    @IsString()
    @MaxLength(30)
    @IsNotEmpty()
    readonly gatewayId: string;

    @IsString()
    @MaxLength(30)
    @IsNotEmpty()
    readonly deviceId: string;

}
