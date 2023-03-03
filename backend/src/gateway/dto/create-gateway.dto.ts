import { IsNotEmpty, IsString, MaxLength, IsIP } from 'class-validator';

export class CreateGatewayDto {
  @IsString()
  @MaxLength(30)
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @MaxLength(30)
  @IsNotEmpty()
  @IsIP(4)
  readonly ipv4: string;
}
