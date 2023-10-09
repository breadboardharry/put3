import { Expose, Type } from "class-transformer";
import { IsDefined } from "class-validator";
import { EventTargetDTO } from "./target.dto";
import { Layout } from "src/app/types/layout";

export class EventLayoutDTO {

    @Expose()
    @IsDefined()
    @Type(() => EventTargetDTO)
    target!: EventTargetDTO;

    @Expose()
    @IsDefined()
    data!: Layout;

}