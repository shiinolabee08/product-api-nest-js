import { NewMessageReceivedInAppInterface } from '../../interfaces/in-app/new-message-received-in-app.interface';
import { InAppEvent } from './in-app.event';

export class NewMessageReceivedInAppEvent extends InAppEvent<NewMessageReceivedInAppInterface> {}
