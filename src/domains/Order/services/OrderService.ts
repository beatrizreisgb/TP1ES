import prisma from '../../../../config/client';
import { Order } from '@prisma/client'; 

class OrderService{
	async create(body: Order){
		const order = await prisma.order.create({
			data: {
				payment: body.payment,
				delivery: body.delivery,
				userId: body.userId,
				productId: body.productId,
			}
		});

		return order;
	}

	async findByCode(code: number){
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

	async updateOrder(code: number, body: Order){
		const updatedOrder = await prisma.order.update({
			where:{
				code: code,
			},
			data:{
				payment: body.payment,
				delivery: body.delivery,
			}
		});

		return updatedOrder;
	}

	async deleteOrder(code: number){
		const deletedOrder = await prisma.order.delete({
			where:{
				code: code,
			}
		});

		return deletedOrder;
	}
}

export default new OrderService();