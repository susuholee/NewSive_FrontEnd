'use client';

type Props = {
  src: string;
  alt: string;
  width?: number;
};

export default function ThumbnailImage({ src, alt, width = 120 }: Props) {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      onError={(e) => {
        e.currentTarget.style.display = 'none';
      }}
    />
  );
}
