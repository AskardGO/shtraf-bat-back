import { Schema, model, Document } from 'mongoose';

export interface IFriendInvitation extends Document {
  fromUserId: string;
  toUserId: string;
  fromUserLogin: string;
  toUserLogin: string;
  status: 'pending' | 'accepted' | 'rejected';
  chatId: string;
  createdAt: Date;
  updatedAt: Date;
}

const friendInvitationSchema = new Schema<IFriendInvitation>({
  fromUserId: { type: String, required: true },
  toUserId: { type: String, required: true },
  fromUserLogin: { type: String, required: true },
  toUserLogin: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'accepted', 'rejected'], 
    default: 'pending' 
  },
  chatId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

friendInvitationSchema.index({ fromUserId: 1, toUserId: 1 });
friendInvitationSchema.index({ toUserId: 1, status: 1 });
friendInvitationSchema.index({ chatId: 1 });

export const FriendInvitation = model<IFriendInvitation>('FriendInvitation', friendInvitationSchema);
