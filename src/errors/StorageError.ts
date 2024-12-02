export class PGStorageError extends Error{
    code: string;

    constructor(message: string, code: string) {
        super(message);
        this.code = code;

        Object.setPrototypeOf(this, PGStorageError.prototype);
    }
}