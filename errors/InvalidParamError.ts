export class InvalidParamError extends Error {
    constructor(msg: string) {
        super(msg);
        this.name = 'InvalidParamError';
    }
}