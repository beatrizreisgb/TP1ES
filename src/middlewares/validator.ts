import { Request, Response, NextFunction } from 'express';
import statusCodes from '../../utils/constants/statuscodes';

export const checkUserRole = (userRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const userRole = req.user.role;
            if (!userRoles.includes(userRole)) {
                return res.status(statusCodes.UNAUTHORIZED).json(`Erro: Usuário não tem permissão para realizar essa ação.`);
            }
            next(); 
        } catch (error) {
            next(error);
        }
    };
};
