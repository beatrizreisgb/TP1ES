import { JsonWebTokenError } from 'jsonwebtoken';
import statusCodes from '../../utils/constants/statuscodes';
import { Request, Response, NextFunction } from 'express';
import { NotAuthorizedError } from '../../errors/NotAuthorizedError';
import { InvalidParamError } from '../../errors/InvalidParamError';
import { TokenError } from '../../errors/TokenError';
import { QueryError } from '../../errors/QueryError';

export function errorHandler(error: Error, req: Request, res: Response, next: NextFunction) {
    const message = error.message;
    let status = statusCodes.INTERNAL_SERVER_ERROR;

    if (error instanceof JsonWebTokenError ||
        error instanceof NotAuthorizedError) {
        status = statusCodes.FORBIDDEN;
    }

    if (error instanceof InvalidParamError) {
        status = statusCodes.BAD_REQUEST;
    }

    if (error instanceof TokenError) {
        status = statusCodes.NOT_FOUND;
    }

    if (error instanceof QueryError) {
        status = statusCodes.BAD_REQUEST;
    }

    console.log(error);
    res.status(status).json(message);
}