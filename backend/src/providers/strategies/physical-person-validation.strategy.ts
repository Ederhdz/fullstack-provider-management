import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProviderDto } from '../dto/create-provider.dto';
import { ProviderValidationStrategy } from './provider-validation.strategy';

@Injectable()
export class PhysicalPersonValidationStrategy
  implements ProviderValidationStrategy
{
  validate(provider: CreateProviderDto): void {
    if (provider.rfc.length !== 13) {
      throw new BadRequestException(
        'Physical person RFC must contain 13 characters',
      );
    }
  }
}