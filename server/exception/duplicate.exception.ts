import { AbstractException } from "./abstract.exception";

export class DuplicateException extends AbstractException {
    constructor(entity: string) {
        super(`Entity already exists with this parameters`, { entity });
    }
}