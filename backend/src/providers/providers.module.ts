import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Provider } from './entities/provider.entity';
import { CreateProviderHandler } from './handlers/create-provider.handler';
import { ProvidersController } from './providers.controller';
import { PhysicalPersonValidationStrategy } from './strategies/physical-person-validation.strategy';
import { ProviderValidationContext } from './strategies/provider-validation.context';
import { LegalEntityValidationStrategy } from './strategies/legal-entity-validation.strategy';

const commandHandlers = [CreateProviderHandler];

@Module({
  imports: [TypeOrmModule.forFeature([Provider]), CqrsModule],
  controllers: [ProvidersController],
  providers: [
    ...commandHandlers,
    PhysicalPersonValidationStrategy,
    LegalEntityValidationStrategy,
    ProviderValidationContext,
  ],
})
export class ProvidersModule {}