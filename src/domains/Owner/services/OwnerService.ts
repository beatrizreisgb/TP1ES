import prisma from '../../../../config/client';
import { Owner } from '@prisma/client'; 

class OwnerService{
	async create(body: Owner){
		const owner = await prisma.owner.create({
			data: {
				email: body.email,
				name: body.name,
				password: body.password,
				role: body.role,
			}
		});

		return owner;
	}

	async findByEmail(email: string){
		const owner = await prisma.owner.findFirst({
			where:{
				email: email,
			}
		});

		return owner;
	}

	async findOwners(){
		const owners = await prisma.owner.findMany();

		return owners;
	}

	async updateOwner(email: string, body: Owner){
		const updatedowner = await prisma.owner.update({
			where:{
				email: email,
			},
			data:{
				email: body.email,
				name: body.name,
				password: body.password,
				role: body.role,
			}
		});

		return updatedowner;
	}

	async deleteOwner(email: string){
		const deletedowner = await prisma.owner.delete({
			where:{
				email: email,
			}
		});

		return deletedowner;
	}
}

export default new OwnerService();