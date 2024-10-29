import ProductService from '../services/ProductService';
import { Router, Request, Response, NextFunction } from 'express';
import { checkUserRole } from '../../../middlewares/validator';
import { verifyJWT } from '../../../middlewares/authentication';

const router = Router();

// get all products
router.get('/', async(req: Request, res: Response, next: NextFunction) => {
	try{
		const owners = await ProductService.findProducts();
		res.json(owners);
	}
	catch(error){
		next(error);
	}
});

// get all products from owner
router.get('/product', verifyJWT, async(req: Request, res: Response, next: NextFunction) => {
	try{
		const owners = await ProductService.findProductsByOwner(+req.user.id);
		res.json(owners);
	}
	catch(error){
		next(error);
	}
});

// get product by id 
router.get('/getById/:id', async(req: Request, res: Response, next: NextFunction) => { 
	try{
		const owner = await ProductService.findById(+req.params.id);
		res.json(owner);
	}
	catch(error){
		next(error);
	}
});

// create product
router.post('/create', verifyJWT, checkUserRole(['admin', 'owner']), async(req: Request, res: Response, next: NextFunction) => {
	try{
		await ProductService.create(req.body, +req.user.id);
		res.json('Produto criado com sucesso!');
	}
	catch(error){
		next(error);
	}
});

router.put('/update/:id', async(req: Request, res: Response, next: NextFunction) => {
	try{
		await ProductService.updateProduct(+req.params.id, req.body);
		res.json('Produto atualizado');
	}
	catch(error){
		next(error);
	}
});

router.delete('/delete/:id', async(req: Request, res: Response, next: NextFunction) => {
	try{
		await ProductService.deleteProduct(+req.params.id);
		res.json('Produto deletado');
	}
	catch(error){
		next(error);
	}
});

export default router;