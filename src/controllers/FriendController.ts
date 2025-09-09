import { friendService, chatService } from "../services";
import { FriendInvitation } from "../models/FriendInvitation";
import { InteractiveMessage } from "../models/InteractiveMessage";
import { UserModel } from "../models/User";
import { MessageModel } from "../models/Message";

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

    async sendFriendInvitation(req: any, reply: any) {
        const user = req.user;
        const { toUserLogin } = req.body;

        if (!toUserLogin) {
            return reply.status(400).send({ error: "toUserLogin is required" });
        }

        try {
            const targetUser = await UserModel.findOne({ login: toUserLogin });
            if (!targetUser) {
                return reply.status(404).send({ error: "User not found" });
            }

            if (targetUser.uid === user.uid) {
                return reply.status(400).send({ error: "Cannot invite yourself" });
            }

            const existingInvitation = await FriendInvitation.findOne({
                fromUserId: user.uid,
                toUserId: targetUser.uid,
                status: 'pending'
            });

            if (existingInvitation) {
                return reply.status(400).send({ error: "Invitation already sent" });
            }

            const chat = await chatService.createChat(user.uid, targetUser.uid);

            const invitation = new FriendInvitation({
                fromUserId: user.uid,
                toUserId: targetUser.uid,
                fromUserLogin: user.login,
                toUserLogin: targetUser.login,
                chatId: chat.id,
                status: 'pending'
            });

            await invitation.save();

            const interactiveMessage = new InteractiveMessage({
                type: 'friend_invitation',
                chatId: chat.id,
                senderId: user.uid,
                content: {
                    text: `${user.login} отправил вам приглашение в друзья`,
                    data: { 
                        invitationId: invitation.id,
                        fromUserLogin: user.login 
                    }
                },
                actions: [
                    {
                        id: 'accept',
                        type: 'accept',
                        label: 'Принять',
                        icon: 'CheckOutlined',
                        color: 'success'
                    },
                    {
                        id: 'decline',
                        type: 'decline',
                        label: 'Отклонить',
                        icon: 'CloseOutlined',
                        color: 'error'
                    }
                ]
            });

            await interactiveMessage.save();

            const regularMessage = new MessageModel({
                chatId: chat.id,
                senderId: user.uid,
                text: `${user.login} отправил вам приглашение в друзья`,
                _id: interactiveMessage._id
            });

            await regularMessage.save();

            return reply.send({ 
                message: "Invitation sent successfully", 
                invitation,
                chatId: chat.id 
            });
        } catch (err: any) {
            return reply.status(500).send({ error: err.message });
        }
    }

    async acceptFriendInvitation(req: any, reply: any) {
        const user = req.user;
        const { invitationId } = req.params;


        try {
            const invitation = await FriendInvitation.findById(invitationId);
            
            if (!invitation) {
                
                const fromUser = await UserModel.findOne({ uid: user.uid });
                if (fromUser) {
                    const interactiveMessages = await InteractiveMessage.find({
                        type: 'friend_invitation',
                        'content.data.invitationId': invitationId
                    });
                    
                    if (interactiveMessages.length > 0) {
                            await InteractiveMessage.deleteMany({
                            type: 'friend_invitation',
                            'content.data.invitationId': invitationId
                        });
                        return reply.send({ message: "Friend invitation already processed" });
                    }
                }
                
                return reply.send({ message: "Friend invitation already processed" });
            }

            if (invitation.toUserId !== user.uid) {
                return reply.status(403).send({ error: "Not authorized to accept this invitation" });
            }

            if (invitation.status === 'accepted') {
                
                try {
                    await friendService.addFriend(invitation.fromUserId, invitation.toUserId);
                } catch (friendError) {
                    console.error('Error adding friends:', friendError);
                }
                
                const deletedMessages = await InteractiveMessage.deleteMany({ 
                    chatId: invitation.chatId,
                    type: 'friend_invitation',
                    'content.data.invitationId': invitationId
                });
                
                await FriendInvitation.findByIdAndDelete(invitationId);
                
                return reply.send({ message: "Friend invitation already accepted" });
            }
            
            if (invitation.status === 'rejected')
              {}

            invitation.status = 'accepted';
            invitation.updatedAt = new Date();
            await invitation.save();

            await friendService.addFriend(invitation.fromUserId, invitation.toUserId);

            const deletedMessages = await InteractiveMessage.deleteMany({ 
                chatId: invitation.chatId,
                type: 'friend_invitation',
                'content.data.invitationId': invitationId
            });

            const systemMessage = new MessageModel({
                chatId: invitation.chatId,
                senderId: 'system',
                text: 'accept',
                isSystem: true
            });
            await systemMessage.save();

            ('Removing processed invitation from database');
            await FriendInvitation.findByIdAndDelete(invitationId);
            ('Invitation removed from database');

            return reply.send({ message: "Friend invitation accepted" });
        } catch (err: any) {
            return reply.status(500).send({ error: err.message });
        }
    }

    async declineFriendInvitation(req: any, reply: any) {
        const user = req.user;
        const { invitationId } = req.params;


        try {
            const invitation = await FriendInvitation.findById(invitationId);
            
            if (!invitation) {
                return reply.status(404).send({ error: "Invitation not found" });
            }

            if (invitation.toUserId !== user.uid) {
                return reply.status(403).send({ error: "Not authorized to decline this invitation" });
            }

            if (invitation.status === 'accepted') {
                return reply.status(400).send({ error: "Cannot decline an already accepted invitation" });
            }
            
            if (invitation.status === 'rejected') {
                return reply.status(400).send({ error: "Invitation already declined" });
            }

            invitation.status = 'rejected';
            invitation.updatedAt = new Date();
            await invitation.save();

            await InteractiveMessage.deleteMany({ 
                chatId: invitation.chatId,
                type: 'friend_invitation',
                'content.data.invitationId': invitationId
            });

            await chatService.archiveChat(invitation.chatId);

            return reply.send({ 
                message: "Friend invitation declined",
                chatDeleted: true 
            });
        } catch (err: any) {
            return reply.status(500).send({ error: err.message });
        }
    }

    async getFriendInvitations(req: any, reply: any) {
        const user = req.user;

        try {
            const invitations = await FriendInvitation.find({
                toUserId: user.uid,
                status: 'pending'
            }).sort({ createdAt: -1 });

            return reply.send(invitations);
        } catch (err: any) {
            return reply.status(500).send({ error: err.message });
        }
    }

    async getRejectedFriends(req: any, reply: any) {
        const user = req.user;

        try {
            const rejectedInvitations = await FriendInvitation.find({
                toUserId: user.uid,
                status: 'rejected'
            }).sort({ updatedAt: -1 });

            return reply.send(rejectedInvitations);
        } catch (err: any) {
            return reply.status(500).send({ error: err.message });
        }
    }

    async acceptRejectedFriend(req: any, reply: any) {
        const user = req.user;
        const { friendRequestId } = req.params;

        try {
            const invitation = await FriendInvitation.findById(friendRequestId);
            if (!invitation) {
                return reply.status(404).send({ error: "Friend request not found" });
            }

            if (invitation.toUserId !== user.uid) {
                return reply.status(403).send({ error: "Not authorized" });
            }

            if (invitation.status !== 'rejected') {
                return reply.status(400).send({ error: "Friend request is not rejected" });
            }

            const chat = await chatService.createChat(invitation.fromUserId, invitation.toUserId);

            invitation.status = 'accepted';
            invitation.chatId = chat.id;
            invitation.updatedAt = new Date();
            await invitation.save();

            await friendService.addFriend(invitation.fromUserId, invitation.toUserId);

            return reply.send({ message: "Friend request accepted", chatId: chat.id });
        } catch (err: any) {
            return reply.status(500).send({ error: err.message });
        }
    }

    async deleteChat(req: any, reply: any) {
        const user = req.user;
        const { chatId } = req.params;

        try {
            await chatService.archiveChat(chatId);
            return reply.send({ message: "Chat archived successfully" });
        } catch (err: any) {
            return reply.status(500).send({ error: err.message });
        }
    }

    async getInteractiveMessages(req: any, reply: any) {
        const user = req.user;
        const { chatId } = req.params;

        try {
            const messages = await InteractiveMessage.find({ chatId }).sort({ createdAt: -1 });
            
            const filteredMessages = [];
            const currentUser = await UserModel.findOne({ uid: user.uid });
            
            for (const message of messages) {
                if (message.type === 'friend_invitation') {
                    const invitationId = message.content?.data?.invitationId;
                    if (invitationId) {
                        const invitation = await FriendInvitation.findById(invitationId);
                        if (invitation) {
                            const otherUserId = invitation.fromUserId === user.uid ? invitation.toUserId : invitation.fromUserId;
                            
                            if (currentUser && currentUser.friends && currentUser.friends.includes(otherUserId)) {
                                continue;
                            }
                        }
                    }
                }
                filteredMessages.push(message);
            }
            
            return reply.send(filteredMessages);
        } catch (err: any) {
            return reply.status(500).send({ error: err.message });
        }
    }

    async cleanupStaleInteractiveMessages(req: any, reply: any) {
        const user = req.user;

        try {
            
            const friendInvitationMessages = await InteractiveMessage.find({ 
                type: 'friend_invitation' 
            });
            
            const currentUser = await UserModel.findOne({ uid: user.uid });
            if (!currentUser) {
                return reply.status(404).send({ error: "User not found" });
            }
            
            let cleanedCount = 0;
            
            for (const message of friendInvitationMessages) {
                const invitationId = message.content?.data?.invitationId;
                if (invitationId) {
                    const invitation = await FriendInvitation.findById(invitationId);
                    if (invitation) {
                        const otherUserId = invitation.fromUserId === user.uid ? invitation.toUserId : invitation.fromUserId;
                        
                        if (currentUser.friends && currentUser.friends.includes(otherUserId)) {
                            await InteractiveMessage.findByIdAndDelete(message._id);
                            await FriendInvitation.findByIdAndDelete(invitationId);
                            cleanedCount++;
                        }
                    } else {
                        await InteractiveMessage.findByIdAndDelete(message._id);
                        cleanedCount++;
                    }
                }
            }
            
            return reply.send({ message: `Cleaned up ${cleanedCount} stale interactive messages` });
        } catch (err: any) {
            console.error('Error cleaning up stale interactive messages:', err);
            return reply.status(500).send({ error: err.message });
        }
    }
}
