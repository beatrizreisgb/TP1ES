import { JwtPayload, sign, verify } from 'jsonwebtoken';
// import prisma from '../../../../config/client';
import { User } from '@prisma/client';
import { NextFunction } from 'express';
import UserService from '../domains/User/services/UserService';
import userRoles from '../../utils/constants/userRoles';
import { compare } from 'bcrypt';
import { TokenError } from '../../errors/TokenError';
import { InvalidParamError } from '../../errors/InvalidParamError';
import { LoginError } from '../../errors/LoginError';

function generateJWT(user: User, res: Response) {
    const body = {
        id: user.id,
        email: user.email,
        role: user.role
    };

    const token = sign({ user: body }, process.env.SECRET_KEY || '', { expiresIn: process.env.JWT_EXPIRATION });

    res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
    });
}

function cookieExtractor(req: Request) {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies['jwt'];
    }

    return token;
}

export function verifyJWT(req: Request, res: Response, next: NextFunction) {
    try {
        const token = cookieExtractor(req);
        if (token) {
            const decoded = verify(token, process.env.SECRET_KEY || '') as JwtPayload;
            req.user = decoded.user;
        }
        if (req.user == null) {
            throw new TokenError('Você precisa estar logado para realizar essa ação!');
        }
        next();
    } catch (error) {
        next(error);
    }
}

export async function loginMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        let user = await UserService.findByEmail(req.body.email);

        if (user == null) {
            throw new InvalidParamError('E-mail incorreto!');
        }

        const matchingPassword = await compare(req.body.password, user.password);

        if (!matchingPassword) {
            throw new InvalidParamError('Senha incorreta!');
        }
        generateJWT(user, res);

        res.status(200).json('Login realizado com sucesso');


    } catch (error) {
        next(error);
    }
}

export async function logoutMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        const token = cookieExtractor(req);
        if(!token){
            throw new TokenError('Você não está logado no sistema!');
        }
        res.clearCookie('jwt');
        res.status(200).json('Logout realizado com sucesso!');
    }
    catch (err) {
        next(err);
    }
}

export function notLoggedIn(req: Request, res: Response, next: NextFunction) {
    try {
        const token = cookieExtractor(req);

        if (token) {
            const decoded = verify(token, process.env.SECRET_KEY || '');
            if (decoded) {
                throw new LoginError('Você já está logado no sistema!');
            }
        }
        next();
    } catch (error) {
        next(error);
    }
}