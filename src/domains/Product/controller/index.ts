import ProductService from '../services/ProductService';
import { Router, Request, Response, NextFunction } from 'express';
import { checkUserRole } from '../../../middlewares/validator';
import { verifyJWT } from '../../../middlewares/authentication';

const router = Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { name, minPrice, maxPrice } = req.query;
		const products = await ProductService.findProducts({
			name:     name as string | undefined,
			minPrice: minPrice ? +minPrice : undefined,
			maxPrice: maxPrice ? +maxPrice : undefined,
		});
		res.json(products);
	} catch (error) {
		next(error);
	}
});

router.get('/product', verifyJWT, async (req: Request, res: Response, next: NextFunction) => {
	try {
		const products = await ProductService.findProductsByOwner(+req.user.id);
		res.json(products);
	} catch (error) {
		next(error);
	}
});

router.get('/getById/:id', verifyJWT, async (req: Request, res: Response, next: NextFunction) => {
	try {
		const product = await ProductService.findById(+req.params.id);
		res.json(product);
	} catch (error) {
		next(error);
	}
});

router.post('/create', verifyJWT, checkUserRole(['admin', 'owner']), async (req: Request, res: Response, next: NextFunction) => {
	try {
		await ProductService.create(req.body, +req.user.id);
		res.json('Produto criado com sucesso!');
	} catch (error) {
		next(error);
	}
});

router.put('/update/:id', verifyJWT, async (req: Request, res: Response, next: NextFunction) => {
	try {
		await ProductService.updateProduct(+req.params.id, req.body);
		res.json('Produto atualizado');
	} catch (error) {
		next(error);
	}
});

router.delete('/delete/:id', verifyJWT, async (req: Request, res: Response, next: NextFunction) => {
	try {
		await ProductService.deleteProduct(+req.params.id);
		res.json('Produto deletado');
	} catch (error) {
		next(error);
	}
});

export default router;
