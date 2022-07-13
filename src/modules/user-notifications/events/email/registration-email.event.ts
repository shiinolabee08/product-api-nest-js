import { RegistrationEmailInterface } from '../../interfaces/email/registration-email.interface';
import { EmailEvent } from './email.event';

export class RegistrationEmailEvent extends EmailEvent<RegistrationEmailInterface> {}
