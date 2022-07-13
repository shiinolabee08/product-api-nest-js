import { TpAccountVerificationCompleteEmailInterface } from '../../interfaces/email/tp-account-verification-complete-email.interface';
import { EmailEvent } from './email.event';

export class TpAccountVerificationCompleteEmailEvent extends EmailEvent<TpAccountVerificationCompleteEmailInterface> {}
