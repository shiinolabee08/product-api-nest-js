import { HttpModule, Module } from '@nestjs/common';
import { PostCodeIoService } from './services/postcode-io.service';
import { PusherService } from './services/pusher.service';

@Module({
  imports: [HttpModule],
  providers: [
    PostCodeIoService,
    PusherService,
  ],
  exports: [
    PostCodeIoService,
    PusherService,
  ]
})
export class CommonModule {}
