import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Pusher from 'pusher';

@Injectable()
export class PusherService {
  private readonly logger: Logger = new Logger(PusherService.name);

  private pusher: Pusher;

  constructor(
    private configService: ConfigService,
  ) {
    this.pusher = new Pusher({
      appId: this.configService.get('PUSHER_APP_ID'),
      key: this.configService.get('PUSHER_APP_KEY'),
      secret: this.configService.get('PUSHER_SECRET'),
      cluster: this.configService.get('PUSHER_CLUSTER'),
      useTLS: this.configService.get('PUSHER_USE_TLS')
    });
  }

  triggerChannel(channel: string, event: string, payload) {
    this.pusher.trigger(channel, event, payload);
  }

  getPusherInstance(): Pusher {
    return this.pusher;
  }
}
