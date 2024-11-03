import OwnerService from '../services/OwnerService';
import { Router, Request, Response, NextFunction } from 'express';
import { verifyJWT } from '../../../middlewares/authentication';
import ProductService from '../../Product/services/ProductService';

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

router.get('/product', verifyJWT, async(req: Request, res: Response, next: NextFunction) => {
	try{
		console.log(req.user.id);
		const orders = await OwnerService.findProductsByOwner(+req.user.id);
		res.json(orders);
	}
	catch(error){
		next(error);
	}
});

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

router.put('/update/:email', verifyJWT, async(req: Request, res: Response, next: NextFunction) => {
	try{
		await OwnerService.updateOwner(req.params.email, req.body);
		res.json('Proprietário atualizado');
	}
	catch(error){
		next(error);
	}
});

router.delete('/delete/:email', verifyJWT, async(req: Request, res: Response, next: NextFunction) => {
	try{
		await OwnerService.deleteOwner(req.params.email);
		res.json('Proprietário deletado');
	}
	catch(error){
		next(error);
	}
});

export default router;