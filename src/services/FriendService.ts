import {UserRepository} from "../repositories/UserRepository";
import {ChatService} from "./ChatService";

export class FriendService {
    constructor(
        private userRepo: UserRepository,
        private chatService: ChatService
    ) {}
    async addFriend(userId: string, friendId: string) {
        const user = await this.userRepo.findById(userId);
        const friend = await this.userRepo.findById(friendId);
        if (!user || !friend) throw new Error("User not found");

        user.friends = user.friends || [];
        if (!user.friends.includes(friend.uid)) {
            user.friends.push(friend.uid);
            await this.userRepo.update(user);
        }

        return await this.chatService.createChat(user, friend);
    }
}
