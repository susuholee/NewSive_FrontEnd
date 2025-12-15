import { MockData } from "@/shared/mock/news";

type Props = {
    params: Promise<{
        id: string
    }>
}

export default async function NewsDetailPage({params} : Props ) {
    const { id } = await params;

    const data = MockData.find(index => index.id === id);

    if (!data) {
        return <div>존재하지 않은 뉴스입니다.</div>
    }
    return (
        <div>
            <h1>{data.title}</h1>
            <p>{data.summary}</p>
            <a href={data.original_link}>
                원문 보기
            </a>
        </div>
    )    
}