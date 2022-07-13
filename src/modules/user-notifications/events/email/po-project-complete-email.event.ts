import { PoProjectCompleteEmailInterface } from '../../interfaces/email/po-project-complete-email.interface';
import { EmailEvent } from './email.event';

export class PoProjectCompleteEmailEvent extends EmailEvent<PoProjectCompleteEmailInterface> {}
