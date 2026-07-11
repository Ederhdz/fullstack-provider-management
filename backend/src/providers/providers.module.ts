import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Provider } from './entities/provider.entity';
import { ChangeProviderStatusHandler } from './handlers/change-provider-status.handler';
import { CreateProviderHandler } from './handlers/create-provider.handler';
import { DeleteProviderHandler } from './handlers/delete-provider.handler';
import { GetProviderByIdHandler } from './handlers/get-provider-by-id.handler';
import { GetProvidersHandler } from './handlers/get-providers.handler';
import { UpdateProviderHandler } from './handlers/update-provider.handler';
import { ProvidersController } from './providers.controller';
import { LegalEntityValidationStrategy } from './strategies/legal-entity-validation.strategy';
import { PhysicalPersonValidationStrategy } from './strategies/physical-person-validation.strategy';
import { ProviderValidationContext } from './strategies/provider-validation.context';

const commandHandlers = [
  CreateProviderHandler,
  UpdateProviderHandler,
  DeleteProviderHandler,
  ChangeProviderStatusHandler,
];

const queryHandlers = [
  GetProvidersHandler,
  GetProviderByIdHandler,
];

@Module({
  imports: [
    TypeOrmModule.forFeature([Provider]),
    CqrsModule,
  ],
  controllers: [ProvidersController],
  providers: [
    ...commandHandlers,
    ...queryHandlers,
    PhysicalPersonValidationStrategy,
    LegalEntityValidationStrategy,
    ProviderValidationContext,
  ],
})
export class ProvidersModule {}