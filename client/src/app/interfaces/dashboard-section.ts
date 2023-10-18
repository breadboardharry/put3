import { Session } from "../classes/session";

export interface DashboardSection {

    /**
     * The list of dashboard sessions
     */
    sessions: Session[];

    /**
     * The target session
     */
    target?: Session;

    /**
     * Whether the section is disabled
     */
    disabled?: boolean;

};