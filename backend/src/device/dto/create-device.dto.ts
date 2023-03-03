import { IsString, MaxLength } from 'class-validator';

export class CreateDeviceDto {
  @IsString()
  @MaxLength(30)
  readonly vendor: string;

  @IsString()
  @MaxLength(30)
  readonly status: string;
}
