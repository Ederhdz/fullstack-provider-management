import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { ChangeProviderStatusCommand } from './commands/change-provider-status.command';
import { CreateProviderCommand } from './commands/create-provider.command';
import { DeleteProviderCommand } from './commands/delete-provider.command';
import { UpdateProviderCommand } from './commands/update-provider.command';
import { ChangeProviderStatusDto } from './dto/change-provider-status.dto';
import { CreateProviderDto } from './dto/create-provider.dto';
import { UpdateProviderDto } from './dto/update-provider.dto';
import { Provider } from './entities/provider.entity';
import { GetProviderByIdQuery } from './queries/get-provider-by-id.query';
import { GetProvidersQuery } from './queries/get-providers.query';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Providers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('providers')
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

  @Put(':id')
  @Roles(UserRole.ADMIN)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProviderDto,
  ): Promise<Provider> {
    return this.commandBus.execute(
      new UpdateProviderCommand(id, dto),
    );
  }

  @Patch(':id/status')
  @Roles(UserRole.ADMIN)
  changeStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ChangeProviderStatusDto,
  ): Promise<Provider> {
    return this.commandBus.execute(
      new ChangeProviderStatusCommand(id, dto.status),
    );
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    return this.commandBus.execute(
      new DeleteProviderCommand(id),
    );
  }
}