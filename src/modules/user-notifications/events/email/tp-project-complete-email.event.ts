import { TpProjectCompleteEmailInterface } from '../../interfaces/email/tp-project-complete-email.interface';
import { EmailEvent } from './email.event';

export class TpProjectCompleteEmailEvent extends EmailEvent<TpProjectCompleteEmailInterface> {}
