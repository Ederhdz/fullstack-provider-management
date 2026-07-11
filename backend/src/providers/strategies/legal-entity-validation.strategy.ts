import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProviderDto } from '../dto/create-provider.dto';
import { ProviderValidationStrategy } from './provider-validation.strategy';

@Injectable()
export class LegalEntityValidationStrategy
  implements ProviderValidationStrategy
{
  validate(provider: CreateProviderDto): void {
    if (provider.rfc.length !== 12) {
      throw new BadRequestException(
        'Legal entity RFC must contain 12 characters',
      );
    }
  }
}