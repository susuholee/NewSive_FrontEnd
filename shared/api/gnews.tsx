import { gnewsAxios } from '../lib/axios';
import { GNewsResponse } from '../types/news';

export async function GetGNews(): Promise<GNewsResponse> {
  const data = await gnewsAxios.get<GNewsResponse>('/top-headlines', {
    params: {
      lang: 'ko',
      max: 10,
    },
  });

  return data.data;
}
