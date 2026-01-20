import { useQuery, useQueryClient } from '@tanstack/react-query';
import { NewsList } from '../api/news.api';

export function useNewsList() {
  const queryClient = useQueryClient();


  const query = useQuery({
    queryKey: ['news'],
    queryFn: () => NewsList(false),
    staleTime: 0,
    refetchOnWindowFocus: false,
  });


  const refresh = async () => {
    const data = await NewsList(true);         
    queryClient.setQueryData(['news'], data);  
  };

  return {
    ...query,
    refresh,          
  };
}
