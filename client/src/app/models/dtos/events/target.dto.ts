import { Expose } from "class-transformer";
import { IsDefined, IsString, MinLength } from "class-validator";

export class EventTargetDTO {

    @Expose()
    @IsDefined()
    @IsString()
    @MinLength(1)
    public uuid!: string;

}