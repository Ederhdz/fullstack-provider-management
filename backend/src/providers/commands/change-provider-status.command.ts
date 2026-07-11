import { ProviderStatus } from '../../common/enums/provider-status.enum';

export class ChangeProviderStatusCommand {
  constructor(
    public readonly id: number,
    public readonly status: ProviderStatus,
  ) {}
}