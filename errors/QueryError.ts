export class QueryError extends Error {
    constructor(msg: string) {
        super(msg);
        this.name = 'QueryError';
    }
}