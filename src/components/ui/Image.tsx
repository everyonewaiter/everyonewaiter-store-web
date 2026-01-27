import {
  type ImgHTMLAttributes,
  type ReactEventHandler,
  useEffect,
  useRef,
  useState,
} from "react";
import cn from "@/lib/utils";

interface ImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackSrc?: string;
  hasBlur?: boolean;
  imageClassName?: string;
}

export default function Image({
  loading = "lazy",
  src,
  onError,
  fallbackSrc,
  alt,
  className,
  hasBlur = false,
  imageClassName,
  ...props
}: Readonly<ImageProps>) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [visible, setVisible] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [useFallback, setUseFallback] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );

    if (wrapperRef.current) observer.observe(wrapperRef.current);

    return () => observer.disconnect();
  }, []);

  const cdnSrc =
    src && src.trim() !== "" ? `${import.meta.env.VITE_PUBLIC_CDN}/${src}` : "";

  const currentSrc = () => {
    if (!visible) return "";
    if (!src || error || (useFallback && fallbackSrc)) return fallbackSrc;
    return cdnSrc;
  };

  const handleError: ReactEventHandler<HTMLImageElement> = (e) => {
    setError(true);
    if (!useFallback) {
      setUseFallback(true);
      if (!fallbackSrc) {
        onError?.(e);
      }
    }
  };

  const blurClassName = () => {
    if (hasBlur) {
      if (loaded) return "blur-0 scale-100";
      return "blur-sm scale-[1.03]";
    }
    return "";
  };

  return (
    <div
      ref={wrapperRef}
      className={cn("h-full w-full relative overflow-hidden", className)}
    >
      {/* Skeleton */}
      {!loaded && visible && hasBlur && (
        <div className="absolute inset-0 w-full h-full animate-pulse bg-gray-700" />
      )}

      {visible && (
        <img
          src={currentSrc()}
          loading={loading}
          onError={handleError}
          alt={alt}
          onLoad={() => setLoaded(true)}
          draggable={false}
          className={cn(
            "h-full w-full object-cover transition-all duration-600",
            blurClassName(),
            imageClassName,
          )}
          {...props}
        />
      )}
    </div>
  );
}
