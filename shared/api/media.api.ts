import { apiClient } from "../lib/axios";
export const uploadChatMedia = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  const res = await apiClient.post('/media', formData);
  return res.data as {
    url: string;
    type: 'IMAGE' | 'VIDEO';
  };
};
