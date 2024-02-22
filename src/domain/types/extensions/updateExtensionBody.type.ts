import { SipDriverEnum } from '../../enums/sipdriver.enum';

export type UpdateExtensionBody = {
  sip_driver?: SipDriverEnum;
  extension_number?: string;
};
