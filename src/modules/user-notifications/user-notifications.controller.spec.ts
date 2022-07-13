import { Test, TestingModule } from '@nestjs/testing';
import { UserNotificationsController } from './user-notifications.controller';

describe('NotificationController', () => {
  let controller: UserNotificationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserNotificationsController],
    }).compile();

    controller = module.get<UserNotificationsController>(UserNotificationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
