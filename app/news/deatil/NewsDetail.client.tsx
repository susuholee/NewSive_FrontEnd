'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';



export default function NewsDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  useEffect(() => {
    if (!id) return;

    router.replace(decodeURIComponent(id as string));
  }, [id, router]);

  return null;
}
