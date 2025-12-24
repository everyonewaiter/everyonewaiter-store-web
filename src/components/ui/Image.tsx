import { type ImgHTMLAttributes, type ReactEventHandler, useState } from "react";

interface ImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackSrc?: string;
  fill?: boolean;
}

export default function Image({
  loading = "lazy",
  src,
  onError,
  fallbackSrc,
  alt,
  ...props
}: Readonly<ImageProps>) {
  const [useFallback, setUseFallback] = useState(false);

  const cdnSrc = src && src.trim() !== "" ? `${import.meta.env.VITE_API_PUBLIC_CDN}/${src}` : "";
  const currentSrc = useFallback && fallbackSrc ? fallbackSrc : cdnSrc;

  const handleError: ReactEventHandler<HTMLImageElement> = (e) => {
    if (!useFallback) {
      setUseFallback(true);
      if (!fallbackSrc) {
        onError?.(e);
      }
    }
  };

  if (!currentSrc || currentSrc.trim() === "") {
    return null;
  }

  return <img src={currentSrc} loading={loading} onError={handleError} alt={alt} {...props} />;
}
