import { MockData } from "@/shared/mock/news";
import Link from "next/link";

export default function NewsPage() {
    return (
        <>
        <h1>뉴스 리스트 페이지입니다.</h1>
        <ul>
            {MockData.map(news => (
                <li key={news.id}>
                    <Link href={`/news/${news.id}`}>
                        {news.title}
                    </Link>
                </li>
            ))}
        </ul>
        </>
    )
}