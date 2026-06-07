import prisma from '../../../../config/client';
import { Order } from '@prisma/client';
import { InvalidParamError } from '../../../../errors/InvalidParamError';
import { QueryError } from '../../../../errors/QueryError';
import { PermissionError } from '../../../../errors/PermissionError';

export const ORDER_STATUS = {
	PENDENTE:    'PENDENTE',
	CONFIRMADO:  'CONFIRMADO',
	EM_ENTREGA:  'EM_ENTREGA',
	ENTREGUE:    'ENTREGUE',
	CANCELADO:   'CANCELADO',
} as const;

type OrderStatus = typeof ORDER_STATUS[keyof typeof ORDER_STATUS];

// Transições válidas por role
const TRANSITIONS: Record<string, Record<OrderStatus, OrderStatus[]>> = {
	owner: {
		PENDENTE:   ['CONFIRMADO', 'CANCELADO'],
		CONFIRMADO: ['CANCELADO'],
		EM_ENTREGA: [],
		ENTREGUE:   [],
		CANCELADO:  [],
	},
	user: {
		PENDENTE:   ['CANCELADO'],
		CONFIRMADO: ['CANCELADO'],
		EM_ENTREGA: [],
		ENTREGUE:   [],
		CANCELADO:  [],
	},
	deliverer: {
		PENDENTE:   [],
		CONFIRMADO: ['EM_ENTREGA'],
		EM_ENTREGA: ['ENTREGUE'],
		ENTREGUE:   [],
		CANCELADO:  [],
	},
	admin: {
		PENDENTE:   ['CONFIRMADO', 'CANCELADO'],
		CONFIRMADO: ['EM_ENTREGA', 'CANCELADO'],
		EM_ENTREGA: ['ENTREGUE', 'CANCELADO'],
		ENTREGUE:   [],
		CANCELADO:  [],
	},
};

class OrderService {
	async create(body: Order, userId: number) {
		if (!['Dinheiro', 'Cartão', 'Pix'].includes(body.payment)) {
			throw new InvalidParamError('Método inválido de pagamento');
		}

		const product = await prisma.product.findFirst({ where: { id: +body.productId } });

		if (!product) {
			throw new QueryError('Produto não encontrado.');
		}

		if (product.quantity <= 0) {
			throw new QueryError('Produto sem estoque disponível.');
		}

		const [order] = await prisma.$transaction([
			prisma.order.create({
				data: {
					payment:   body.payment,
					delivery:  product.price + 20,
					status:    ORDER_STATUS.PENDENTE,
					userId:    userId,
					productId: +body.productId,
				},
			}),
			prisma.product.update({
				where: { id: product.id },
				data:  { quantity: product.quantity - 1 },
			}),
		]);

		return order;
	}

	async findByCode(code: string) {
		const order = await prisma.order.findFirst({ where: { code } });
		return order;
	}

	async findOrdersByUser(userId: number) {
		return prisma.order.findMany({ where: { userId } });
	}

	async findOrders() {
		return prisma.order.findMany();
	}

	async updateStatus(code: string, newStatus: string, userRole: string, userId: number) {
		const order = await prisma.order.findFirst({ where: { code } });

		if (!order) {
			throw new QueryError('Pedido não encontrado.');
		}

		const current = order.status as OrderStatus;
		const allowed = TRANSITIONS[userRole]?.[current] ?? [];

		if (!allowed.includes(newStatus as OrderStatus)) {
			throw new PermissionError(
				`Transição de '${current}' para '${newStatus}' não permitida para ${userRole}.`
			);
		}

		// Ao cancelar, devolve o estoque
		if (newStatus === ORDER_STATUS.CANCELADO) {
			await prisma.$transaction([
				prisma.order.update({ where: { id: order.id }, data: { status: newStatus } }),
				prisma.product.update({
					where: { id: order.productId },
					data:  { quantity: { increment: 1 } },
				}),
			]);
		} else if (newStatus === ORDER_STATUS.EM_ENTREGA) {
			// Entregador assume o pedido
			const deliverer = await prisma.deliverer.findFirst({ where: { userId } });
			if (!deliverer) {
				throw new QueryError('Entregador não encontrado.');
			}
			await prisma.order.update({
				where: { id: order.id },
				data:  { status: newStatus, delivererId: deliverer.id },
			});
		} else {
			await prisma.order.update({ where: { id: order.id }, data: { status: newStatus } });
		}
	}

	async updateOrder(code: string, body: Order) {
		const order = await prisma.order.findFirst({ where: { code } });

		return prisma.order.update({
			where: { id: order.id },
			data:  { payment: body.payment, delivery: body.delivery },
		});
	}

	async deleteOrder(code: string) {
		const order = await prisma.order.findFirst({ where: { code } });
		return prisma.order.delete({ where: { id: order.id } });
	}
}

export default new OrderService();
