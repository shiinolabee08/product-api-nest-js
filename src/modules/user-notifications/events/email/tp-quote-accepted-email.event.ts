import { TpQuoteAcceptedEmailInterface } from '../../interfaces/email/tp-quote-accepted-email.interface';
import { EmailEvent } from './email.event';

export class TpQuoteAcceptedEmailEvent extends EmailEvent<TpQuoteAcceptedEmailInterface> {}
