import { Expose } from "class-transformer";
import { IsDefined } from "class-validator";
import { ResourceSet } from "src/app/types/resources/data-set";

export class EventResourcesDTO {

    @Expose()
    @IsDefined()
    data!: ResourceSet;

}