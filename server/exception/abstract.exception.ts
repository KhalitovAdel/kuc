export abstract class AbstractException extends Error {
    override readonly name: string = this.constructor.name;

    constructor(message?: string, meta?: object);
    constructor(meta?: object, message?: string);
    constructor(message?: string | object, private readonly meta?: object | string) {
        super(
            typeof message === 'string' 
                ? message 
                : typeof meta === 'string'
                    ? meta
                    : undefined
        );
    }

    /** @description For external users */
    public toJSON() {
        return {
            name: this.name,
            message: this.message,
            meta: this.meta,
        } as const;
    }

    /** @description For loggers */
    public override toString(): string {
        return JSON.stringify({ ...this.toJSON(), stack: this.stack, message: this.message, meta: this.meta });
    }
}