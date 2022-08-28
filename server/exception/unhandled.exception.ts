import { AbstractException } from "./abstract.exception";

export class UnhandledException extends AbstractException {
    constructor(originalError?: unknown) {
        super({ originalError });
    }
}