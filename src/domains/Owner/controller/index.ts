import OwnerService from '../services/OwnerService';
import { Router, Request, Response, NextFunction } from 'express';

const router = Router();

router.get('/', async(req: Request, res: Response, next: NextFunction) => {
	try{
		const owners = await OwnerService.findOwners();
		res.json(owners);
	}
	catch(error){
		next(error);
	}
});

//localhost:3000/joaolucas@email.com
router.get('/:email', async(req: Request, res: Response, next: NextFunction) => { 
	try{
		const owner = await OwnerService.findByEmail(req.params.email);
		res.json(owner);
	}
	catch(error){
		next(error);
	}
});

router.post('/create', async(req: Request, res: Response, next: NextFunction) => {
	try{
		await OwnerService.create(req.body);
		res.json('Proprietário criado com sucesso!');
	}
	catch(error){
		next(error);
	}
});

router.put('/update/:email', async(req: Request, res: Response, next: NextFunction) => {
	try{
		await OwnerService.updateOwner(req.params.email, req.body);
		res.json('Proprietário atualizado');
	}
	catch(error){
		next(error);
	}
});

router.delete('/delete/:email', async(req: Request, res: Response, next: NextFunction) => {
	try{
		await OwnerService.deleteOwner(req.params.email);
		res.json('Proprietário deletado');
	}
	catch(error){
		next(error);
	}
});

export default router;