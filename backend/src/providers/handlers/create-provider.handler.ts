import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProviderCommand } from '../commands/create-provider.command';
import { Provider } from '../entities/provider.entity';
import { ProviderValidationContext } from '../strategies/provider-validation.context';

@CommandHandler(CreateProviderCommand)
export class CreateProviderHandler
  implements ICommandHandler<CreateProviderCommand>
{
  constructor(
    @InjectRepository(Provider)
    private readonly providerRepository: Repository<Provider>,
    private readonly validationContext: ProviderValidationContext,
  ) {}

  async execute(command: CreateProviderCommand): Promise<Provider> {
    const providerData = {
      type: command.type,
      businessName: command.businessName,
      rfc: command.rfc.toUpperCase(),
      email: command.email.toLowerCase(),
      phone: command.phone,
    };

    const strategy = this.validationContext.getStrategy(command.type);
    strategy.validate(providerData);

    const provider = this.providerRepository.create(providerData);

    return this.providerRepository.save(provider);
  }
}