import prisma from '../../../../config/client';
import { User } from '@prisma/client';

class UserService{
	async create(body: User){
		const user = await prisma.user.create({
			data: {
				email: body.email,
				name: body.name,
				password: body.password,
				photo: body.photo,
				role: body.role,
			}
		});

		return user;
	}

	async findByEmail(email: string){
		const user = await prisma.user.findFirst({
			where:{
				email: email,
			}
		});

		return user;
	}

	async findUsers(){
		const users = await prisma.user.findMany();

		return users;
	}
}

export default new UserService();