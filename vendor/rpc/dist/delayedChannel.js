import { Relay } from "./foundation.js";
export function getDelayedChannel(promise) {
    return {
        call(command, arg, cancellationToken) {
            return promise.then((channel) => channel.call(command, arg, cancellationToken));
        },
        listen(event, arg) {
            const relay = new Relay();
            promise.then((channel) => {
                relay.input = channel.listen(event, arg);
            });
            return relay.event;
        },
    };
}
//# sourceMappingURL=delayedChannel.js.map