import { UserModel, IUser } from "../models/User";

export class UserRepository {
    async create(user: Partial<IUser>) {
        return UserModel.create(user);
    }

    async findByLogin(login: string) {
        return UserModel.findOne({ login });
    }

    async findByUid(uid: string) {
        return UserModel.findOne({ uid });
    }

    async updateStatus(uid: string, isOnline: boolean) {
        return UserModel.updateOne({ uid }, { isOnline, lastSeen: new Date() });
    }

    async setRefreshToken(uid: string, token: string | null) {
        return UserModel.updateOne({ uid }, { refreshToken: token });
    }

    async findAll() {
        return UserModel.find();
    }

    async update(uid: string, data: Partial<IUser>) {
        return UserModel.updateOne({ uid }, data);
    }
}
