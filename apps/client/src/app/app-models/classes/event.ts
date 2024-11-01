import { EventMessage, EventTargetData } from "../types/event";

export class Event {

    public name: string;
    public target?: EventTargetData;
    public data?: any;

    constructor(name: string, content?: EventMessage) {
        this.name = name;
        this.target = content?.target;
        this.data = content?.data;
    }

    public getMessage(): EventMessage {
        return {
            target: this.target,
            data: this.data,
        };
    }

}