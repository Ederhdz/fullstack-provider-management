import { Injectable } from '@nestjs/common';
import { ProviderType } from '../../common/enums/provider-type.enum';
import { LegalEntityValidationStrategy } from './legal-entity-validation.strategy';
import { PhysicalPersonValidationStrategy } from './physical-person-validation.strategy';
import { ProviderValidationStrategy } from './provider-validation.strategy';

@Injectable()
export class ProviderValidationContext {
  constructor(
    private readonly physicalPersonStrategy: PhysicalPersonValidationStrategy,
    private readonly legalEntityStrategy: LegalEntityValidationStrategy,
  ) {}

  getStrategy(type: ProviderType): ProviderValidationStrategy {
    const strategies: Record<ProviderType, ProviderValidationStrategy> = {
      [ProviderType.PHYSICAL_PERSON]: this.physicalPersonStrategy,
      [ProviderType.LEGAL_ENTITY]: this.legalEntityStrategy,
    };

    return strategies[type];
  }
}