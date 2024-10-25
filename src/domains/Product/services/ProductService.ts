import prisma from '../../../../config/client';
import { Product } from '@prisma/client'; 

class ProductService{
	async create(body: Product){
		const product = await prisma.product.create({
			data: {
				name: body.name,
				description: body.description,
				price: +body.price,
				ownerId: body.ownerId,
			}
		});

		return product;
	}

	async findById(id: number){
		const product = await prisma.product.findFirst({
			where:{
				id: id,
			}
		});

		return product;
	}

	async findProducts(){
		const products = await prisma.product.findMany();

		return products;
	}

	async updateProduct(id: number, body: Product){
		const updatedProduct = await prisma.product.update({
			where:{
				id: id,
			},
			data:{
				name: body.name,
				description: body.description,
				price: +body.price,
			}
		});

		return updatedProduct;
	}

	async deleteProduct(id: number){
		const deletedProduct = await prisma.product.delete({
			where:{
				id: id,
			}
		});

		return deletedProduct;
	}
}

export default new ProductService();