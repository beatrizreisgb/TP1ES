import DelivererService from '../services/DelivererService';
import { Router, Request, Response, NextFunction } from 'express';
import { verifyJWT } from '../../../middlewares/authentication';
import { checkUserRole } from '../../../middlewares/validator';

const router = Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
	try {
		const deliverers = await DelivererService.findAll();
		res.json(deliverers);
	} catch (error) {
		next(error);
	}
});

router.get('/myOrders', verifyJWT, checkUserRole(['deliverer']), async (req: Request, res: Response, next: NextFunction) => {
	try {
		const orders = await DelivererService.findOrders(+req.user.id);
		res.json(orders);
	} catch (error) {
		next(error);
	}
});

router.post('/create', async (req: Request, res: Response, next: NextFunction) => {
	try {
		await DelivererService.create(req.body);
		res.json('Entregador cadastrado com sucesso!');
	} catch (error) {
		next(error);
	}
});

router.put('/updateRegion', verifyJWT, checkUserRole(['deliverer']), async (req: Request, res: Response, next: NextFunction) => {
	try {
		await DelivererService.updateRegion(+req.user.id, req.body.region);
		res.json('Região atualizada com sucesso!');
	} catch (error) {
		next(error);
	}
});

router.delete('/delete', verifyJWT, checkUserRole(['deliverer', 'admin']), async (req: Request, res: Response, next: NextFunction) => {
	try {
		await DelivererService.delete(+req.user.id);
		res.json('Entregador removido com sucesso.');
	} catch (error) {
		next(error);
	}
});

export default router;
