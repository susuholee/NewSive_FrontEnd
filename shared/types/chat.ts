export type ChatMedia = {
  id: string;
  type: 'IMAGE' | 'VIDEO';
  url: string;
};


export type ChatMessage = {
  id: string;
  senderId: number;
  senderNickname: string;
  content: string | null;
  medias?: ChatMedia[];
  isDeleted: boolean;
  createdAt: string;
  editedAt : string | null;
};
