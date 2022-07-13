import { NotificationInAppTypeEnum } from '../../../../common/enums/notification-in-app-type.enum';
import { NotificationStateEnum } from '../../../../common/enums/notification-state.enum';

export class InAppEvent<T> {
  name: string;

  toUserId: number;

  fromUserId: number;

  type: string | NotificationInAppTypeEnum;

  metaData: T;

  sourceId: string;

  sourceType: string | NotificationInAppTypeEnum;

  state: string | NotificationStateEnum;
}
