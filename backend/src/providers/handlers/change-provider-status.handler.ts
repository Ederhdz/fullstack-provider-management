import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChangeProviderStatusCommand } from '../commands/change-provider-status.command';
import { Provider } from '../entities/provider.entity';

@CommandHandler(ChangeProviderStatusCommand)
export class ChangeProviderStatusHandler
  implements ICommandHandler<ChangeProviderStatusCommand>
{
  constructor(
    @InjectRepository(Provider)
    private readonly providerRepository: Repository<Provider>,
  ) {}

  async execute(command: ChangeProviderStatusCommand): Promise<Provider> {
    const provider = await this.providerRepository.findOneBy({
      id: command.id,
    });

    if (!provider) {
      throw new NotFoundException('Provider not found');
    }

    provider.status = command.status;

    return this.providerRepository.save(provider);
  }
}