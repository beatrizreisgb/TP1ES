import OrderService from '../services/OrderService';
import { Router, Request, Response, NextFunction } from 'express';
import { verifyJWT } from '../../../middlewares/authentication';

const router = Router();

router.get('/', async(req: Request, res: Response, next: NextFunction) => {
	try{
		const orders = await OrderService.findOrders();
		res.json(orders);
	}
	catch(error){
		next(error);
	}
});

router.get('/order', verifyJWT, async(req: Request, res: Response, next: NextFunction) => {
	try{
		const orders = await OrderService.findOrdersByUser(+req.user.id);
		res.json(orders);
	}
	catch(error){
		next(error);
	}
});

router.get('/:code', async(req: Request, res: Response, next: NextFunction) => { 
	try{
		const order = await OrderService.findByCode(+req.params.code);
		res.json(order);
	}
	catch(error){
		next(error);
	}
});

router.post('/create', verifyJWT, async(req: Request, res: Response, next: NextFunction) => {
	try{
		await OrderService.create(req.body, +req.user.id);
		res.json('Pedido feito com sucesso!');
	}
	catch(error){
		next(error);
	}
});

router.put('/update/:code', async(req: Request, res: Response, next: NextFunction) => {
	try{
		await OrderService.updateOrder(+req.params.code, req.body);
		res.json('Pedido atualizado');
	}
	catch(error){
		next(error);
	}
});

router.delete('/delete/:code', async(req: Request, res: Response, next: NextFunction) => {
	try{
		await OrderService.deleteOrder(+req.params.code);
		res.json('Pedido deletado');
	}
	catch(error){
		next(error);
	}
});

export default router;