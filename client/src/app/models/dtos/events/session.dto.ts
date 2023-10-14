import { Expose } from "class-transformer";
import { IsDefined } from "class-validator";
import { SessionData } from "src/app/services/session-service/session.service";

export class EventActionDTO {

    @Expose()
    @IsDefined()
    data!: SessionData;

}