export class RestrictedCelError extends Error {
    offset;
    constructor(message, offset) {
        super(`${message} at offset ${offset}`);
        this.name = "RestrictedCelError";
        this.offset = offset;
    }
}
export class ModelOptionMapError extends Error {
    constructor(message) {
        super(message);
        this.name = "ModelOptionMapError";
    }
}
//# sourceMappingURL=types.js.map