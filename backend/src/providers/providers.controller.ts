import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CreateProviderCommand } from './commands/create-provider.command';
import { CreateProviderDto } from './dto/create-provider.dto';
import { Provider } from './entities/provider.entity';
import { GetProviderByIdQuery } from './queries/get-provider-by-id.query';
import { GetProvidersQuery } from './queries/get-providers.query';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('providers')
export class ProvidersController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @Roles(UserRole.ADMIN)
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

  @Get()
  findAll(): Promise<Provider[]> {
    return this.queryBus.execute(new GetProvidersQuery());
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Provider> {
    return this.queryBus.execute(
      new GetProviderByIdQuery(id),
    );
  }
}