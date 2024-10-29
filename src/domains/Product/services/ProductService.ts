import prisma from '../../../../config/client';
import { Product } from '@prisma/client'; 

//https://stackoverflow.com/questions/5585957/get-latlng-from-zip-code-google-maps-api
class ProductService{
	async create(body: Product, userId: number){
		const owner = await prisma.owner.findFirst({where : {userId: userId}});

		const product = await prisma.product.create({
			data: {
				name: body.name,
				description: body.description,
				price: +body.price,
				ownerId: owner.id,
				location: +body.location,
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

	async findProductsByOwner(id: number){
		const owner = await prisma.owner.findFirst({where: {userId: id}});

		const products = await prisma.product.findMany({where: {ownerId: owner.id}});

		return products;
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
				location: +body.location,
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