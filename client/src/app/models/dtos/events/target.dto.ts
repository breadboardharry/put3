import { Expose } from "class-transformer";
import { IsDefined, IsOptional, IsString, MinLength } from "class-validator";

export class EventTargetDTO {

    @Expose()
    @IsOptional()
    @IsString()
    @MinLength(1)
    public uuid?: string;

    @Expose()
    @IsOptional()
    @IsString()
    @MinLength(1)
    public code?: string;

}