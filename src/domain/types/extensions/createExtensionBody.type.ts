import { SipDriverEnum } from '../../enums/sipdriver.enum';

export type CreateExtensionBody = {
  sip_driver: SipDriverEnum;
  extension_number: string;
};
