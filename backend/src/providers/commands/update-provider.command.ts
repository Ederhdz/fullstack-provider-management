import { UpdateProviderDto } from '../dto/update-provider.dto';

export class UpdateProviderCommand {
  constructor(
    public readonly id: number,
    public readonly data: UpdateProviderDto,
  ) {}
}