// verificar implementação

export const checkRole = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try{
            let errorMessage = '';
            if (roles.includes(userRoles.PREMIUM_USER)) {
                errorMessage = ' Se você acabou de se tornar um Usuário Premium e deveira poder realizar essa ação, tente logar novamente no sistema.';
            }
            !roles.includes(req.user.role) ? res.status(401).json('Você não tem permissão para realizar essa ação!' + errorMessage) : next();
        }
        catch(error){
            next(error);
        }
    };
};