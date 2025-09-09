import { FastifyInstance } from 'fastify';
import { FriendController } from '../controllers/FriendController';

export async function friendsRoutes(fastify: FastifyInstance) {
  const friendController = new FriendController();

  fastify.post('/friends/add', friendController.addFriend.bind(friendController));
  fastify.post('/friends/remove/:friendId', friendController.removeFriend.bind(friendController));
  fastify.get('/friends/list', friendController.listFriends.bind(friendController));

  fastify.post('/friends/invite', friendController.sendFriendInvitation.bind(friendController));
  fastify.post('/friends/invite/:invitationId/accept', friendController.acceptFriendInvitation.bind(friendController));
  fastify.post('/friends/invite/:invitationId/decline', friendController.declineFriendInvitation.bind(friendController));
  fastify.get('/friends/invitations', friendController.getFriendInvitations.bind(friendController));
  
  fastify.get('/friends/rejected', friendController.getRejectedFriends.bind(friendController));
  fastify.post('/friends/rejected/:friendRequestId/accept', friendController.acceptRejectedFriend.bind(friendController));
  
  fastify.delete('/chats/:chatId', friendController.deleteChat.bind(friendController));
}
