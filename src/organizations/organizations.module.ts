import { Module } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { OrganizationsGateway } from './organizations.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import { OrganizationSchema } from './schema/organization.schema';
import { OrganizationController } from './organizations.controller';
import { TempService } from '../messages/temp.service';
import { TempSchema } from '../messages/schema/temp.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Organization', schema: OrganizationSchema },
      // {name:"Temp",schema:TempSchema}
    ]),
  ],
  controllers:[OrganizationController],
  providers: [ OrganizationsService],
  exports:[OrganizationsService]
})
export class OrganizationsModule {}
