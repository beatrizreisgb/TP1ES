import prisma from '../../../../config/client';
import { Owner } from '@prisma/client'; 

class OwnerService{
	async create(body: Owner){
		const owner = await prisma.owner.create({
			data: {
				email: body.email,
				name: body.name,
				password: body.password,
				photo: body.photo,
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

	async findowners(){
		const owners = await prisma.owner.findMany();

		return owners;
	}

	async updateowner(email: string, body: owner){
		const updatedowner = await prisma.owner.update({
			where:{
				email: email,
			},
			data:{
				email: body.email,
				name: body.name,
				password: body.password,
				photo: body.photo,
				role: body.role,
			}
		});

		return updatedowner;
	}

	async deleteowner(email: string){
		const deletedowner = await prisma.owner.delete({
			where:{
				email: email,
			}
		});

		return deletedowner;
	}
}

export default new OwnerService();