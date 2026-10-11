export class AcknowledgedRelayDeadline {
    graceMs;
    now;
    readState;
    onExpired;
    timer;
    disposed = false;
    constructor(graceMs, now, readState, onExpired) {
        this.graceMs = graceMs;
        this.now = now;
        this.readState = readState;
        this.onExpired = onExpired;
    }
    check() {
        if (this.disposed)
            return false;
        const selected = this.select();
        if (!selected || this.now() < selected.deadline)
            return false;
        this.onExpired(selected.fault);
        return true;
    }
    refresh() {
        if (this.disposed)
            return;
        this.clear();
        const selected = this.select();
        if (!selected)
            return;
        this.timer = setTimeout(() => {
            this.timer = undefined;
            if (!this.check())
                this.refresh();
        }, Math.max(0, selected.deadline - this.now()));
    }
    dispose() {
        this.disposed = true;
        this.clear();
    }
    select() {
        const state = this.readState();
        const data = state.oldestData;
        const ack = state.pendingAck;
        if (!data && !ack)
            return null;
        if (ack && (!data || ack.queuedAt <= data.queuedAt)) {
            return {
                deadline: ack.queuedAt + this.graceMs + 1,
                fault: {
                    reasonCode: "remote.rpcFrame.ackGraceExceeded",
                    terminal: true,
                    messageSeq: ack.messageSeq,
                },
            };
        }
        return {
            deadline: data.queuedAt + this.graceMs + 1,
            fault: {
                reasonCode: "remote.rpcFrame.replayGraceExceeded",
                terminal: true,
                messageSeq: data.messageSeq,
            },
        };
    }
    clear() {
        if (this.timer)
            clearTimeout(this.timer);
        this.timer = undefined;
    }
}
//# sourceMappingURL=webRemoteControlAcknowledgedRelayDeadline.js.map