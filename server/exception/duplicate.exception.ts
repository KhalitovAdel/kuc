import { AbstractException } from "./abstract.exception";

//TODO Can be not entity
export class DuplicateException extends AbstractException {
    constructor(entity: string) {
        super(`Entity already exists with this parameters`, { entity });
    }
}