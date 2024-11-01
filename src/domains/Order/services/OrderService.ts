import prisma from '../../../../config/client';
import { Order } from '@prisma/client'; 
import { InvalidParamError } from '../../../../errors/InvalidParamError';

class OrderService{
	async create(body: Order, id: number){

		if (!["Dinheiro", "Cartão", "Pix"].includes(body.payment)) {
			throw new InvalidParamError("Método inválido de pagamento");
		}

		const product = await prisma.product.findFirst({where: {id: +body.productId}});

		const order = await prisma.order.create({
			data: {
				payment: body.payment,
				delivery: product.price + 20,
				userId: id,
				productId: +body.productId,
			}
		});

		return order;
	}

	async findByCode(code: string){
		const order = await prisma.order.findFirst({
			where:{
				code: code,
			}
		});

		return order;
	}

	async findOrdersByUser(id: number){
		const orders = await prisma.order.findMany({where: {userId: id}});

		return orders;
	}

	async findOrders(){
		const orders = await prisma.order.findMany();

		return orders;
	}

	async updateOrder(code: string, body: Order){
		const order = await prisma.order.findFirst({
			where: {
				code: code
			}
		});
		const updatedOrder = await prisma.order.update({
			where:{
				id: order.id,
			},
			data:{
				payment: body.payment,
				delivery: body.delivery,
			}
		});

		return updatedOrder;
	}

	async deleteOrder(code: string){
		const order = await prisma.order.findFirst({
			where: {
				code: code
			}
		});
		const deletedOrder = await prisma.order.delete({
			where:{
				id: order.id,
			}
		});

		return deletedOrder;
	}
}

export default new OrderService();