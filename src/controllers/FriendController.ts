import { friendService } from "../services";

export class FriendController {
    async addFriend(req: any, reply: any) {
        const user = req.user;
        const friendId = req.query.friendId;

        if (!friendId) {
            return reply.status(400).send({ error: "FriendId is required" });
        }

        try {
            const chat = await friendService.addFriend(user.uid, friendId);
            return reply.send({ message: "Friend added", chat });
        } catch (err: any) {
            return reply.status(400).send({ error: err.message });
        }
    }

    async removeFriend(req: any, reply: any) {
        const user = req.user;
        const { friendId } = req.params;

        if (!friendId) {
            return reply.status(400).send({ error: "FriendId is required" });
        }

        try {
            const result = await friendService.removeFriend(user.uid, friendId);
            return reply.send(result);
        } catch (err: any) {
            return reply.status(400).send({ error: err.message });
        }
    }

    async listFriends(req: any, reply: any) {
        const user = req.user;

        try {
            const friends = await friendService.listFriends(user.uid);
            return reply.send({ friends });
        } catch (err: any) {
            return reply.status(400).send({ error: err.message });
        }
    }
}
