import { OrganizationsService } from "./organizations.service";
import {Controller,Get,Param,Query} from "@nestjs/common"
import { Organization } from "./schema/organization.schema";




@Controller("organizations")
export class OrganizationController{
    constructor(private organizationService:OrganizationsService){}

    @Get()
    async testing():Promise<any>{
return this.organizationService.findAll()
    }

    @Get("/finOneByParams")
    async findOneByParams(@Query()query:any):Promise<Organization[]>{
      const organisation =await this.organizationService.findOneByParams(query.accessCode,query.showTimeId,query.name)
      return organisation
    }

}