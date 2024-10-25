import ProductService from '../services/ProductService';
import { Router, Request, Response, NextFunction } from 'express';

const router = Router();

router.get('/', async(req: Request, res: Response, next: NextFunction) => {
	try{
		const owners = await ProductService.findProducts();
		res.json(owners);
	}
	catch(error){
		next(error);
	}
});

//localhost:3000/joaolucas@email.com
router.get('/:id', async(req: Request, res: Response, next: NextFunction) => { 
	try{
		const owner = await ProductService.findById(req.params.id);
		res.json(owner);
	}
	catch(error){
		next(error);
	}
});

router.post('/create', async(req: Request, res: Response, next: NextFunction) => {
	try{
		await ProductService.create(req.body);
		res.json('Proprietário criado com sucesso!');
	}
	catch(error){
		next(error);
	}
});

router.put('/update/:id', async(req: Request, res: Response, next: NextFunction) => {
	try{
		await ProductService.updateProduct(req.params.id, req.body);
		res.json('Proprietário atualizado');
	}
	catch(error){
		next(error);
	}
});

router.delete('/delete/:id', async(req: Request, res: Response, next: NextFunction) => {
	try{
		await ProductService.deleteProduct(req.params.id);
		res.json('Proprietário deletado');
	}
	catch(error){
		next(error);
	}
});

export default router;