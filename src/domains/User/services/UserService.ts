import prisma from '../../../../config/client';
import { User } from '@prisma/client';
import { hash } from 'bcrypt';

class UserService{

	async encryptPassword(password: string) {
        const saltRounds = 10;
        return await hash(password, saltRounds);
    }

	async create(body: User){
		const user = await prisma.user.create({
			data: {
				email: body.email,
				name: body.name,
				password: await this.encryptPassword(body.password),
				address: +body.address,
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

	async updateUser(email: string, body: User){
		// if (body.role ) completar com loggedUser
		const updatedUser = await prisma.user.update({
			where:{
				email: email,
			},
			data:{
				email: body.email,
				name: body.name,
				password: await this.encryptPassword(body.password),
				address: +body.address,
				role: body.role,
			}

		});

		return updatedUser;
	}

	async deleteUser(email: string){
		const deletedUser = await prisma.user.delete({
			where:{
				email: email,
			}
		});

		return deletedUser;
	}
}

export default new UserService();