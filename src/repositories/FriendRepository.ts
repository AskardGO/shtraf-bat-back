import { UserModel, IUser } from "../models/User";

export class FriendRepository {
    async addFriend(userId: string, friendId: string) {
        const user = await UserModel.findOne({ uid: userId });
        if (!user) throw new Error("User not found");

        user.friends = user.friends || [];
        if (!user.friends.includes(friendId)) {
            user.friends.push(friendId);
            await user.save();
        }

        return user;
    }

    async removeFriend(userId: string, friendId: string) {
        const user = await UserModel.findOne({ uid: userId });
        if (!user) throw new Error("User not found");

        user.friends = user.friends?.filter(fid => fid !== friendId) || [];
        await user.save();

        return user;
    }

    async getFriends(userId: string) {
        const user = await UserModel.findOne({ uid: userId });
        return user?.friends || [];
    }
}
