export const formatRelativeTime = (date: string | Date) => {
  const now = new Date();
  const target = new Date(date);
  const diff = Math.floor((now.getTime() - target.getTime()) / 1000);

  if (diff < 60) return '방금 전';
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
  if (diff < 172800) return '어제';

  return target.toLocaleDateString('ko-KR');
};



export const formatChatTime = (date: string | Date) => {
  const target = new Date(date);
  const now = new Date();
  const diff = Math.floor((now.getTime() - target.getTime()) / 1000);

  if (diff < 60) {
    return target.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  if (diff < 86400) {
    return target.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

 
  if (diff < 172800) {
    return "어제";
  }


  return target.toLocaleDateString("ko-KR", {
    month: "numeric",
    day: "numeric",
  });
};
