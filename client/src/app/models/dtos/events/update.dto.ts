import { Expose } from "class-transformer";
import { IsDefined } from "class-validator";
import { EnumUpdateType } from "src/app/enums/type-update";
import { ResourceSet } from "src/app/types/resources/data-set";

export class EventUpdateDTO {

    @Expose()
    @IsDefined()
    data!: { type: EnumUpdateType, value: ResourceSet | any[] };

}