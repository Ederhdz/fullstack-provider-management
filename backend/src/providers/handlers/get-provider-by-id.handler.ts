import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Provider } from '../entities/provider.entity';
import { GetProviderByIdQuery } from '../queries/get-provider-by-id.query';

@QueryHandler(GetProviderByIdQuery)
export class GetProviderByIdHandler
  implements IQueryHandler<GetProviderByIdQuery>
{
  constructor(
    @InjectRepository(Provider)
    private readonly providerRepository: Repository<Provider>,
  ) {}

  async execute(query: GetProviderByIdQuery): Promise<Provider> {
    const provider = await this.providerRepository.findOneBy({
      id: query.id,
    });

    if (!provider) {
      throw new NotFoundException('Provider not found');
    }

    return provider;
  }
}