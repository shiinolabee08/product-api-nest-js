import { TpQuoteRejectedEmailInterface } from '../../interfaces/email/tp-quote-rejected-email.interface';
import { EmailEvent } from './email.event';

export class TpQuoteRejectedEmailEvent extends EmailEvent<TpQuoteRejectedEmailInterface> {}
