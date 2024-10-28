import prisma from '../../../../config/client';
import { User } from '@prisma/client';
import { hash } from 'bcrypt';
import { InvalidParamError } from '../../../../errors/InvalidParamError';
import { QueryError } from '../../../../errors/QueryError';

class UserService{

	async encryptPassword(password: string) {
        const saltRounds = 10;
        return await hash(password, saltRounds);
    }

	async create(body: User, role: string = 'user'){
		if (await this.findByEmail(body.email)) {
			throw new QueryError("Esse email já está cadastrado.");
		}
		const address_string = body.address.toString();
		var regex = /\d{8}/;

		if (!regex.test(address_string)) {
			throw new InvalidParamError("Esse CEP não é válido.");
		}
		const user = await prisma.user.create({
			data: {
				email: body.email,
				name: body.name,
				password: await this.encryptPassword(body.password),
				address: +body.address,
				role: role,
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
		const updatedUser = await prisma.user.update({
			where:{
				email: email,
			},
			data:{
				email: body.email,
				name: body.name,
				password: await this.encryptPassword(body.password),
				address: +body.address,
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