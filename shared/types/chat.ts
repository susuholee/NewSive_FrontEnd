export type ChatMessage = {
  id: string;
  senderId: number;
  senderNickname: string;
  content: string | null;
  isDeleted: boolean;
  createdAt: string;
  editedAt : string | null;
};
