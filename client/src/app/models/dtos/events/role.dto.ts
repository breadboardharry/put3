import { Expose, Type } from "class-transformer";
import { IsDefined } from "class-validator";
import { EventTargetDTO } from "./target.dto";
import { RoleRequestData, RoleResponseData } from "src/app/services/event-service/event.service";

export class EventRoleDTO {

    @Expose()
    @IsDefined()
    @Type(() => EventTargetDTO)
    target!: EventTargetDTO;

    @Expose()
    @IsDefined()
    data!: RoleRequestData | RoleResponseData;

}