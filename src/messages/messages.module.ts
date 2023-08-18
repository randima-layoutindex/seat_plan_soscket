import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesGateway, TempseatController } from './messages.gateway';
import { TempService } from './temp.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TempSchema } from './schema/temp.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {name:"Temp",schema:TempSchema}
    ]),
  ],
  controllers:[TempseatController],
  providers: [MessagesGateway, MessagesService,TempService],
  exports:[TempService]
})
export class MessagesModule {}
