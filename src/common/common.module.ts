import { HttpModule, Module } from '@nestjs/common';
import { CognitoService } from './services/aws/services/cognito.service';
import { PostCodeIoService } from './services/postcode-io.service';
import { PusherService } from './services/pusher.service';

@Module({
  imports: [HttpModule],
  providers: [
    PostCodeIoService,
    PusherService,
    CognitoService,
  ],
  exports: [
    PostCodeIoService,
    PusherService,
    CognitoService,
  ]
})
export class CommonModule {}
