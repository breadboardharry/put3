import { Expose, Type } from "class-transformer";
import { IsDefined, IsObject, IsString } from "class-validator";
import { EventTargetDTO } from "./target.dto";
import { Action } from "src/app/types/action";

export class EventActionDTO {

    @Expose()
    @IsDefined()
    @Type(() => EventTargetDTO)
    target!: EventTargetDTO;

    @Expose()
    @IsDefined()
    data!: Action;

}