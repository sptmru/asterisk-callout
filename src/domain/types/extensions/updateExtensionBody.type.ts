import { SipDriverEnum } from '../../enums/sipdriver.enum';

export type UpdateExtensionBody = {
  sipDriver?: SipDriverEnum;
  extensionNumber?: string;
};
