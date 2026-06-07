import prisma from '../../../../config/client';
import { Product } from '@prisma/client';
import { QueryError } from '../../../../errors/QueryError';
import { InvalidParamError } from '../../../../errors/InvalidParamError';

class ProductService {
	async create(body: Product, userId: number) {
		const owner = await prisma.owner.findFirst({ where: { userId } });

		if (!owner) {
			throw new QueryError('Usuário não é um proprietário de estabelecimento.');
		}

		if (body.quantity !== undefined && +body.quantity < 0) {
			throw new InvalidParamError('Quantidade não pode ser negativa.');
		}

		const product = await prisma.product.create({
			data: {
				name:        body.name,
				description: body.description,
				price:       +body.price,
				ownerId:     owner.id,
				location:    +body.location,
				quantity:    body.quantity !== undefined ? +body.quantity : 0,
			},
		});

		return product;
	}

	async findById(id: number) {
		return prisma.product.findFirst({ where: { id } });
	}

	async findProductsByOwner(userId: number) {
		const owner = await prisma.owner.findFirst({ where: { userId } });

		if (!owner) {
			throw new QueryError('Proprietário não encontrado.');
		}

		return prisma.product.findMany({ where: { ownerId: owner.id } });
	}

	async findProducts(filters?: { name?: string; maxPrice?: number; minPrice?: number }) {
		const where: any = {};

		if (filters?.name) {
			where.name = { contains: filters.name };
		}

		if (filters?.minPrice !== undefined || filters?.maxPrice !== undefined) {
			where.price = {};
			if (filters.minPrice !== undefined) where.price.gte = +filters.minPrice;
			if (filters.maxPrice !== undefined) where.price.lte = +filters.maxPrice;
		}

		return prisma.product.findMany({ where });
	}

	async updateProduct(id: number, body: Partial<Product>) {
		if (body.quantity !== undefined && +body.quantity < 0) {
			throw new InvalidParamError('Quantidade não pode ser negativa.');
		}

		return prisma.product.update({
			where: { id },
			data: {
				name:        body.name,
				description: body.description,
				price:       body.price !== undefined ? +body.price : undefined,
				location:    body.location !== undefined ? +body.location : undefined,
				quantity:    body.quantity !== undefined ? +body.quantity : undefined,
			},
		});
	}

	async deleteProduct(id: number) {
		return prisma.product.delete({ where: { id } });
	}
}

export default new ProductService();
