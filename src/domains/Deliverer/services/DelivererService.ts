import prisma from '../../../../config/client';
import { User } from '@prisma/client';
import { hash } from 'bcrypt';
import { QueryError } from '../../../../errors/QueryError';
import { InvalidParamError } from '../../../../errors/InvalidParamError';

class DelivererService {
	private async encryptPassword(password: string) {
		return hash(password, 10);
	}

	async create(body: User & { region: string }) {
		const existing = await prisma.user.findFirst({ where: { email: body.email } });
		if (existing) {
			throw new QueryError('Esse email já está cadastrado.');
		}

		if (!body.region || body.region.trim() === '') {
			throw new InvalidParamError('Região de atuação é obrigatória.');
		}

		const user = await prisma.user.create({
			data: {
				email:    body.email,
				name:     body.name,
				password: await this.encryptPassword(body.password),
				address:  +body.address,
				role:     'deliverer',
			},
		});

		const deliverer = await prisma.deliverer.create({
			data: {
				userId: user.id,
				region: body.region,
			},
		});

		return deliverer;
	}

	async findByUserId(userId: number) {
		return prisma.deliverer.findFirst({ where: { userId } });
	}

	async findAll() {
		return prisma.deliverer.findMany({ include: { user: { select: { name: true, email: true } } } });
	}

	async updateRegion(userId: number, region: string) {
		if (!region || region.trim() === '') {
			throw new InvalidParamError('Região não pode ser vazia.');
		}

		const deliverer = await prisma.deliverer.findFirst({ where: { userId } });
		if (!deliverer) {
			throw new QueryError('Entregador não encontrado.');
		}

		return prisma.deliverer.update({
			where: { id: deliverer.id },
			data:  { region },
		});
	}

	async findOrders(userId: number) {
		const deliverer = await prisma.deliverer.findFirst({ where: { userId } });
		if (!deliverer) {
			throw new QueryError('Entregador não encontrado.');
		}

		return prisma.order.findMany({ where: { delivererId: deliverer.id } });
	}

	async delete(userId: number) {
		const deliverer = await prisma.deliverer.findFirst({ where: { userId } });
		if (!deliverer) {
			throw new QueryError('Entregador não encontrado.');
		}

		await prisma.$transaction([
			prisma.deliverer.delete({ where: { id: deliverer.id } }),
			prisma.user.delete({ where: { id: userId } }),
		]);
	}
}

export default new DelivererService();
