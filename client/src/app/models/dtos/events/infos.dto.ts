import { Expose, Type } from "class-transformer";
import { IsDefined } from "class-validator";
import { EventTargetDTO } from "./target.dto";
import { Window } from "src/app/types/window";

export class EventInfosDTO {

    @Expose()
    @Type(() => EventTargetDTO)
    target?: EventTargetDTO;

    @Expose()
    @IsDefined()
    data!: Window;

}