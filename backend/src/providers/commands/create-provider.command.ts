import { ProviderType } from '../../common/enums/provider-type.enum';

export class CreateProviderCommand {
  constructor(
    public readonly type: ProviderType,
    public readonly businessName: string,
    public readonly rfc: string,
    public readonly email: string,
    public readonly phone: string,
  ) {}
}