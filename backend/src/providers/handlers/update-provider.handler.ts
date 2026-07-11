import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateProviderCommand } from '../commands/update-provider.command';
import { Provider } from '../entities/provider.entity';
import { ProviderValidationContext } from '../strategies/provider-validation.context';

@CommandHandler(UpdateProviderCommand)
export class UpdateProviderHandler
  implements ICommandHandler<UpdateProviderCommand>
{
  constructor(
    @InjectRepository(Provider)
    private readonly providerRepository: Repository<Provider>,
    private readonly validationContext: ProviderValidationContext,
  ) {}

  async execute(command: UpdateProviderCommand): Promise<Provider> {
    const provider = await this.providerRepository.findOneBy({
      id: command.id,
    });

    if (!provider) {
      throw new NotFoundException('Provider not found');
    }

    const updatedData = {
      ...command.data,
      rfc: command.data.rfc?.toUpperCase(),
      email: command.data.email?.toLowerCase(),
    };

    const mergedProvider = this.providerRepository.merge(
      provider,
      updatedData,
    );

    const strategy = this.validationContext.getStrategy(mergedProvider.type);

    strategy.validate({
      type: mergedProvider.type,
      businessName: mergedProvider.businessName,
      rfc: mergedProvider.rfc,
      email: mergedProvider.email,
      phone: mergedProvider.phone,
    });

    return this.providerRepository.save(mergedProvider);
  }
}