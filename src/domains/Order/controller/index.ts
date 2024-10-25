import OrderService from '../services/OrderService';
import { Router, Request, Response, NextFunction } from 'express';

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

//localhost:3000/joaolucas@email.com
router.get('/:code', async(req: Request, res: Response, next: NextFunction) => { 
	try{
		const order = await OrderService.findByCode(req.params.code);
		res.json(order);
	}
	catch(error){
		next(error);
	}
});

router.post('/create', async(req: Request, res: Response, next: NextFunction) => {
	try{
		await OrderService.create(req.body);
		res.json('Pedido feito com sucesso!');
	}
	catch(error){
		next(error);
	}
});

router.put('/update/:code', async(req: Request, res: Response, next: NextFunction) => {
	try{
		await OrderService.updateOrder(req.params.code, req.body);
		res.json('Pedido atualizado');
	}
	catch(error){
		next(error);
	}
});

router.delete('/delete/:code', async(req: Request, res: Response, next: NextFunction) => {
	try{
		await OrderService.deleteOrder(req.params.code);
		res.json('Pedido deletado');
	}
	catch(error){
		next(error);
	}
});

export default router;