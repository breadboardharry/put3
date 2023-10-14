import { Expose, Type } from "class-transformer";
import { IsArray, IsDefined } from "class-validator";
import { EventTargetDTO } from "./target.dto";

export class EventFoolListDTO {

    @Expose()
    @Type(() => EventTargetDTO)
    target?: EventTargetDTO;

    @Expose()
    @IsDefined()
    @IsArray()
    data!: { [key: string]: any }[];

}