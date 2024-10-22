import OwnerService from '../services/OwnerService';
import { Router, Request, Response, NextFunction } from 'express';

const router = Router();

router.get('/', async(req: Request, res: Response, next: NextFunction) => {
	try{
		const users = await UserService.findUsers();
		res.json(users);
	}
	catch(error){
		next(error);
	}
});
//localhost:3000/joaolucas@email.com
router.get('/:email', async(req: Request, res: Response, next: NextFunction) => { 
	try{
		const user = await UserService.findByEmail(req.params.email);
		res.json(user);
	}
	catch(error){
		next(error);
	}
});

router.post('/create', async(req: Request, res: Response, next: NextFunction) => {
	try{
		await UserService.create(req.body);
		res.json('Usuário criado com sucesso!');
	}
	catch(error){
		next(error);
	}
});

router.put('/update/:email', async(req: Request, res: Response, next: NextFunction) => {
	try{
		await UserService.updateUser(req.params.email, req.body);
		res.json('Usuário atualizado');
	}
	catch(error){
		next(error);
	}
});

router.delete('/delete/:email', async(req: Request, res: Response, next: NextFunction) => {
	try{
		await UserService.deleteUser(req.params.email); // + para number
		res.json('Usuário deletado');
	}
	catch(error){
		next(error);
	}
});

export default router;