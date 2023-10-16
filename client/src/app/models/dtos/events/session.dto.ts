import { Expose, Type } from "class-transformer";
import { IsDefined } from "class-validator";
import { EventTargetDTO } from "./target.dto";
import { Action } from "src/app/types/action";

export class EventSessionDTO {

    @Expose()
    @Type(() => EventTargetDTO)
    target?: EventTargetDTO;

    @Expose()
    @IsDefined()
    data!: Action;

}