import { SipDriverEnum } from '../../enums/sipdriver.enum';

export type CreateExtensionBody = {
  sipDriver: SipDriverEnum;
  extensionNumber: string;
};
