import { CreateProviderDto } from '../dto/create-provider.dto';

export interface ProviderValidationStrategy {
  validate(provider: CreateProviderDto): void;
}