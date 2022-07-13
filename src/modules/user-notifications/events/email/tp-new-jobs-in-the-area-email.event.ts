import { TpNewJobsInTheAreaEmailInterface } from '../../interfaces/email/tp-new-jobs-in-the-area-email.interface';
import { EmailEvent } from './email.event';

export class TpNewJobsInTheAreaEmailEvent extends EmailEvent<TpNewJobsInTheAreaEmailInterface> {}
