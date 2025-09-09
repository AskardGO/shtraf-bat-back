import { Schema, model, Document } from 'mongoose';

export interface IInteractiveMessage extends Document {
  type: 'friend_invitation' | 'system' | 'custom';
  chatId: string;
  senderId: string;
  content: {
    text: string;
    data?: any;
  };
  actions?: Array<{
    id: string;
    type: 'accept' | 'decline' | 'custom';
    label: string;
    icon?: string;
    variant?: 'contained' | 'outlined' | 'text';
    color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning';
    disabled?: boolean;
  }>;
  isInteractive: boolean;
  createdAt: Date;
}

const interactiveMessageSchema = new Schema<IInteractiveMessage>({
  type: { 
    type: String, 
    enum: ['friend_invitation', 'system', 'custom'], 
    required: true 
  },
  chatId: { type: String, required: true },
  senderId: { type: String, required: true },
  content: {
    text: { type: String, required: true },
    data: { type: Schema.Types.Mixed }
  },
  actions: [{
    id: { type: String, required: true },
    type: { 
      type: String, 
      enum: ['accept', 'decline', 'custom'], 
      required: true 
    },
    label: { type: String, required: true },
    icon: { type: String },
    variant: { 
      type: String, 
      enum: ['contained', 'outlined', 'text'],
      default: 'contained'
    },
    color: { 
      type: String, 
      enum: ['primary', 'secondary', 'success', 'error', 'warning'],
      default: 'primary'
    },
    disabled: { type: Boolean, default: false }
  }],
  isInteractive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

interactiveMessageSchema.index({ chatId: 1, createdAt: -1 });
interactiveMessageSchema.index({ type: 1, chatId: 1 });

export const InteractiveMessage = model<IInteractiveMessage>('InteractiveMessage', interactiveMessageSchema);
