import { UserModel, IUser } from "../models/User";

export class UserRepository {
    async create(user: Partial<IUser>) {
        return UserModel.create(user);
    }

    async findByLogin(login: string) {
        return UserModel.findOne({ login });
    }
}
