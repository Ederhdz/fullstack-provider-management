import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateProviderCommand } from './commands/create-provider.command';
import { CreateProviderDto } from './dto/create-provider.dto';
import { Provider } from './entities/provider.entity';

@Controller('providers')
export class ProvidersController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  create(@Body() dto: CreateProviderDto): Promise<Provider> {
    return this.commandBus.execute(
      new CreateProviderCommand(
        dto.type,
        dto.businessName,
        dto.rfc,
        dto.email,
        dto.phone,
      ),
    );
  }
}