import ReviewService from '../services/ReviewService';
import { Router, Request, Response, NextFunction } from 'express';
import { verifyJWT } from '../../../middlewares/authentication';
import { checkUserRole } from '../../../middlewares/validator';

const router = Router();

router.post('/:code', verifyJWT, checkUserRole(['user']), async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { rating, comment } = req.body;
		const review = await ReviewService.create(req.params.code, +req.user.id, +rating, comment);
		res.status(201).json(review);
	} catch (error) {
		next(error);
	}
});

router.get('/order/:code', verifyJWT, async (req: Request, res: Response, next: NextFunction) => {
	try {
		const review = await ReviewService.findByOrderCode(req.params.code);
		res.json(review);
	} catch (error) {
		next(error);
	}
});

router.get('/myReviews', verifyJWT, checkUserRole(['owner']), async (req: Request, res: Response, next: NextFunction) => {
	try {
		const reviews = await ReviewService.findByOwner(+req.user.id);
		res.json(reviews);
	} catch (error) {
		next(error);
	}
});

export default router;
