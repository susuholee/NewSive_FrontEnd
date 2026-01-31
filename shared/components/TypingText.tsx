"use client";

import { useEffect, useState } from "react";

type Props = {
  title: string;
  description: string;
  titleSpeed?: number;
  textSpeed?: number;
};

export default function TypingText({
  title,
  description,
  titleSpeed = 45,
  textSpeed = 30,
}: Props) {
  const [typedTitle, setTypedTitle] = useState("");
  const [typedDesc, setTypedDesc] = useState("");
  const [phase, setPhase] = useState<"title" | "desc">("title");

  useEffect(() => {
    let index = 0;

    const interval = setInterval(() => {
      if (phase === "title") {
        setTypedTitle(title.slice(0, index + 1));
        index++;

        if (index >= title.length) {
          index = 0;
          setPhase("desc");
        }
      } else {
        setTypedDesc(description.slice(0, index + 1));
        index++;

        if (index >= description.length) {
          clearInterval(interval);
        }
      }
    }, phase === "title" ? titleSpeed : textSpeed);

    return () => clearInterval(interval);
  }, [phase, title, description, titleSpeed, textSpeed]);

  return (
    <div className="text-center">
      <h1
        className="
          text-5xl md:text-6xl
          font-extrabold
          tracking-tight
          leading-tight
          min-h-[96px]
          md:min-h-[120px]
        "
      >
        {typedTitle}
      </h1>

      <p
        className="
          mt-6
          mx-auto
          max-w-xl
          text-2xl
          leading-relaxed
          text-text-secondary
          whitespace-pre-wrap
          min-h-[96px]
        "
      >
        {typedDesc}
      </p>
    </div>
  );
}
