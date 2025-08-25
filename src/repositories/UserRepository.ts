import { UserModel, IUser } from "../models/User";

export class UserRepository {
    async create(user: Partial<IUser>) {
        return UserModel.create(user);
    }

    async findByLogin(login: string) {
        return UserModel.findOne({ login });
    }

    async findById(uid: string) {
        return UserModel.findOne({ uid });
    }

    async update(user: IUser) {
        return UserModel.findOneAndUpdate({ uid: user.uid }, user, { new: true });
    }


    async updateStatus(uid: string, online: boolean) {
        return UserModel.findOneAndUpdate(
            { uid },
            { isOnline: online, lastSeen: online ? null : new Date() },
            { new: true }
        );
    }

}
