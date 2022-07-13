import { PoTpJobAcceptedEmailInterface } from '../../interfaces/email/po-tp-job-accepted-email.interface';
import { EmailEvent } from './email.event';

export class PoTpJobAcceptedEmailEvent extends EmailEvent<PoTpJobAcceptedEmailInterface> {}
