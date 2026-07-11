import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';
import { ProviderType } from '../../common/enums/provider-type.enum';

export class CreateProviderDto {
  @IsEnum(ProviderType)
  type: ProviderType;

  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  businessName: string;

  @IsString()
  @Length(12, 13)
  rfc: string;

  @IsEmail()
  @MaxLength(150)
  email: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  phone: string;
}