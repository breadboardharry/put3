import { Expose, Type } from "class-transformer";
import { IsDefined, IsEnum } from "class-validator";
import { EnumUpdateType } from "src/app/enums/type-update";
import { ResourceSet } from "src/app/types/resources/data-set";

export class EventUpdateDTO {

    @Expose()
    @IsDefined()
    @Type(() => EventUpdateDataDTO)
    data!: EventUpdateDataDTO;

}

export class EventUpdateDataDTO {

    @Expose()
    @IsDefined()
    @IsEnum(EnumUpdateType)
    type!: EnumUpdateType;

    @Expose()
    @IsDefined()
    value!: ResourceSet | any[];

}