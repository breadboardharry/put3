import { SocketServer } from "../../servers/socket/socket-server";

export default class SocketService {

    /**
     * Emit an event via socket
     * @param key Socket event name
     * @param data Data to send
     * @param extras Extra options
     * - targets (optionnal) List of targets uuid to send the event to
     * - success (optionnal) If the event is a success or not
     * - message (optionnal) Message to send with the event
     */
    public static emit(key: string, data: any, extras?: { targets?: string[], success?: boolean, message?: string }): void {

        const targets = extras?.targets || [];
        const message: { data: any, success?: boolean, message?: string} = {
            data: data,
            success: extras?.success,
            message: extras?.message,
        };

        if (!targets.length) {
            SocketServer.emit(key, message);
            return;
        }

        for (const targetId of targets) {
            const client = SocketServer.clients.get(targetId);
            if (!client) {
                console.error(`Socket ${targetId} not found`);
                return;
            }
            client.emit(key, message);
        }
    }
}