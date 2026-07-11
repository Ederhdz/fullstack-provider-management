import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeleteProviderCommand } from '../commands/delete-provider.command';
import { Provider } from '../entities/provider.entity';

@CommandHandler(DeleteProviderCommand)
export class DeleteProviderHandler
  implements ICommandHandler<DeleteProviderCommand>
{
  constructor(
    @InjectRepository(Provider)
    private readonly providerRepository: Repository<Provider>,
  ) {}

  async execute(
    command: DeleteProviderCommand,
  ): Promise<{ message: string }> {
    const provider = await this.providerRepository.findOneBy({
      id: command.id,
    });

    if (!provider) {
      throw new NotFoundException('Provider not found');
    }

    await this.providerRepository.remove(provider);

    return {
      message: 'Provider deleted successfully',
    };
  }
}