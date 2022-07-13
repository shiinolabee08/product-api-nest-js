import { PoQuoteReceivedEmailInterface } from '../../interfaces/email/po-quote-received-email.interface';
import { EmailEvent } from './email.event';

export class PoQuoteReceivedEmailEvent extends EmailEvent<PoQuoteReceivedEmailInterface> {}
