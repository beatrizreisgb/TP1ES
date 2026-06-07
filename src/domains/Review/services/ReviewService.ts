import prisma from '../../../../config/client';
import { QueryError } from '../../../../errors/QueryError';
import { InvalidParamError } from '../../../../errors/InvalidParamError';
import { PermissionError } from '../../../../errors/PermissionError';
import { ORDER_STATUS } from '../../Order/services/OrderService';

class ReviewService {
	async create(code: string, userId: number, rating: number, comment?: string) {
		if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
			throw new InvalidParamError('A nota deve ser um número inteiro entre 1 e 5.');
		}

		const order = await prisma.order.findFirst({ where: { code } });

		if (!order) {
			throw new QueryError('Pedido não encontrado.');
		}

		if (order.userId !== userId) {
			throw new PermissionError('Apenas o comprador pode avaliar o pedido.');
		}

		if (order.status !== ORDER_STATUS.ENTREGUE) {
			throw new PermissionError('Só é possível avaliar pedidos com status ENTREGUE.');
		}

		const existing = await prisma.review.findFirst({ where: { orderId: order.id } });
		if (existing) {
			throw new QueryError('Este pedido já foi avaliado.');
		}

		return prisma.review.create({
			data: {
				orderId: order.id,
				rating,
				comment: comment ?? null,
			},
		});
	}

	async findByOrderCode(code: string) {
		const order = await prisma.order.findFirst({ where: { code } });
		if (!order) {
			throw new QueryError('Pedido não encontrado.');
		}

		return prisma.review.findFirst({ where: { orderId: order.id } });
	}

	async findByOwner(ownerId: number) {
		return prisma.review.findMany({
			where: {
				order: {
					product: { ownerId },
				},
			},
			include: { order: { select: { code: true, productId: true } } },
		});
	}
}

export default new ReviewService();
