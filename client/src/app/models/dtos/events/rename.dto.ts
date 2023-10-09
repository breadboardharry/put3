import { Expose, Type } from "class-transformer";
import { IsDefined, IsString, MinLength } from "class-validator";
import { EventTargetDTO } from "./target.dto";
import 'reflect-metadata';

export class EventRenameDTO {

    @Expose()
    @IsDefined()
    @Type(() => EventTargetDTO)
    target!: EventTargetDTO;

    @Expose()
    @IsDefined()
    @IsString()
    @MinLength(1)
    data!: string;

}