import { PoTpJobRejectedEmailInterface } from '../../interfaces/email/po-tp-job-rejected-email.interface';
import { EmailEvent } from './email.event';

export class PoTpJobRejectedEmailEvent extends EmailEvent<PoTpJobRejectedEmailInterface> {}
