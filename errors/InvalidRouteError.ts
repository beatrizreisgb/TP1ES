export class InvalidRouteError extends Error {
    constructor(msg: string) {
        super(msg);
        this.name = 'InvalidRouteError';
    }
}