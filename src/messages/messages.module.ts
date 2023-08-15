import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesGateway } from './messages.gateway';
import { TempService } from './temp.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TempSchema } from './schema/temp.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      // { name: 'Organization', schema: OrganizationSchema },
      {name:"Temp",schema:TempSchema}
    ]),
  ],
  providers: [MessagesGateway, MessagesService,TempService],
  exports:[TempService]
})
export class MessagesModule {}
