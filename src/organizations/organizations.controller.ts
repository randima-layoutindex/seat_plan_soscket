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
    async findOneByParams(@Query("accessCode")accessCode:string,@Query("showTimeId")showTimeId:string):Promise<Organization[]>{
        // console.log(accessCode,showTimeId)
      const organisation =await this.organizationService.findOneByParams(accessCode,showTimeId)
      return organisation
    }

}