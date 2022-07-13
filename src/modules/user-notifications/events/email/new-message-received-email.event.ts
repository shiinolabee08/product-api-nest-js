import { NewMessageReceivedEmailInterface } from '../../interfaces/email/new-message-received-email.interface';
import { EmailEvent } from './email.event';

export class NewMessageReceivedEmailEvent extends EmailEvent<NewMessageReceivedEmailInterface> {}
