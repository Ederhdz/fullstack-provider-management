import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Provider } from './entities/provider.entity';
import { ProvidersController } from './providers.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Provider])],
  controllers: [ProvidersController],
})
export class ProvidersModule {}