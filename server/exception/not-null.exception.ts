import { AbstractException } from "./abstract.exception";

export class NotNullException extends AbstractException {
    constructor(resource: string) {
        super(`Not found resource ${resource}`);
    }
}