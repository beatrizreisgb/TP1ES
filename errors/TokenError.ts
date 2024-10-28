export class TokenError extends Error {
    constructor(msg: string) {
        super(msg);
        this.name = 'TokenError';
    }
}