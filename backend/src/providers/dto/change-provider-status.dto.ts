import { IsEnum } from 'class-validator';
import { ProviderStatus } from '../../common/enums/provider-status.enum';

export class ChangeProviderStatusDto {
  @IsEnum(ProviderStatus)
  status: ProviderStatus;
}