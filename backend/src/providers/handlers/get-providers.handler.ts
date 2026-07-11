import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Provider } from '../entities/provider.entity';
import { GetProvidersQuery } from '../queries/get-providers.query';

@QueryHandler(GetProvidersQuery)
export class GetProvidersHandler
  implements IQueryHandler<GetProvidersQuery>
{
  constructor(
    @InjectRepository(Provider)
    private readonly providerRepository: Repository<Provider>,
  ) {}

  execute(): Promise<Provider[]> {
    return this.providerRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });
  }
}