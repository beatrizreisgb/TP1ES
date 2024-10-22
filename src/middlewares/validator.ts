// verificar implementação

export const checkUserRole = (expectedRole: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const userRole = req.user.role;
            if (userRole !== expectedRole) {
                console.log(`Error: User does not have the required role. Expected: ${expectedRole}, but got: ${userRole}`);
                return res.status(401).json(`You don't have permission to perform this action. Required role: ${expectedRole}`);
            }
            next(); 
        } catch (error) {
            next(error);
        }
    };
};
