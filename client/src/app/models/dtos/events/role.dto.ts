import { Expose, Type } from "class-transformer";
import { IsDefined, IsEnum, IsObject, IsOptional, IsString, MinLength } from "class-validator";
import { EventTargetDTO } from "./target.dto";
import { EnumUserRole } from "src/app/enums/role";

export class EventRoleDTO {

    @Expose()
    @IsDefined()
    @Type(() => EventTargetDTO)
    target!: EventTargetDTO;

    @Expose()
    @IsDefined()
    @Type(() => EventRoleDataDTO)
    data!: EventRoleDataDTO;

}

export class EventRoleDataDTO {

    @Expose()
    @IsDefined()
    @IsEnum(EnumUserRole)
    role!: EnumUserRole;

    @Expose()
    @IsOptional()
    @IsObject()
    preferences?: { [key: string]: any };

}