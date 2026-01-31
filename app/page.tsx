
import Link from "next/link";
import TypingText from "@/shared/components/TypingText";


export default function Home() {
  return (
    <main className="bg-background text-text-primary">
      <section className="flex min-h-[85vh] flex-col items-center justify-center px-6 text-center">
        
        <div className="mb-6 flex items-center gap-2 text-xl font-bold text-primary">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
          NewSive
        </div>

   
        <TypingText
          title="지금의 세상을 읽다"
          description={`정보 습득, 알림, 그리고 친구들과 소통을 통해 \n정보를 공유하는`}
        />
        <Link
          href="/login"
          className="mt-10 rounded-full bg-primary px-10 py-3 text-sm font-semibold text-white hover:bg-primary-hover transition"
        >
          지금 시작하기
        </Link>
      </section>

 
  <section className="bg-primary-soft/40 py-20">
    <div className="mx-auto max-w-5xl px-6">

      <div className="mb-14 text-center">
        <h2 className="text-2xl font-bold tracking-tight">
          NewSive의 핵심 기능
        </h2>
        <p className="mt-3 text-sm text-text-secondary">
          실시간 정보 흐름을 놓치지 않도록 설계되었습니다.
        </p>
      </div>


    <div className="flex flex-wrap justify-center gap-8">
      <Feature title="실시간 뉴스">
        최신 이슈를 실시간으로 받아보고 중요한 흐름을 놓치지 마세요.
      </Feature>

      <Feature title="맞춤 알림">
        친구 요청과 시스템 알림을 실시간으로 받아볼 수 있습니다.
      </Feature>

      <Feature title="실시간 채팅">
        뉴스 이후의 대화를 친구와 바로 나눌 수 있습니다.
      </Feature>

      <Feature title="날씨 정보">
        현재 위치 기반의 실시간 날씨 정보를 제공합니다.
      </Feature>
    </div>



    </div>
  </section>

  </main>
  );
}

function Feature({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-surface p-8 transition hover:-translate-y-1 hover:shadow-sm">
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-text-secondary">
        {children}
      </p>
    </div>
  );
}
