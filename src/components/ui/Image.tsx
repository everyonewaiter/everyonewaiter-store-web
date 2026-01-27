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
}

export default function Image({
  loading = "lazy",
  src,
  onError,
  fallbackSrc,
  alt,
  className,
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

  return (
    <div ref={wrapperRef} className="relative h-full w-full overflow-hidden">
      {/* Skeleton */}
      {!loaded && visible && (
        <div className="absolute inset-0 animate-pulse bg-gray-300" />
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
            loaded ? "blur-0 scale-100" : "blur-sm scale-[1.03]",
            className
          )}
          {...props}
        />
      )}
    </div>
  );
}
