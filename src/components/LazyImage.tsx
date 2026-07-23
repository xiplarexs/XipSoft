"use client";

import { useState, useEffect, useRef } from "react";

/**
 * Cloudinary responsive URL seti.
 * Upload API'den dönen `urls` objesiyle eslesir.
 */
export interface ResponsiveUrls {
  thumb: string;    // ~200px  — thumbnail
  mobile: string;   // ~480px  — mobil
  tablet: string;   // ~900px  — tablet
  desktop: string;  // ~1600px — masaüstü
  original: string; // orijinal
}

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  width?: number;
  height?: number;
  fallback?: string;
  /**
   * Cloudinary responsive URL seti.
   * Verilirse srcset + sizes ile dogru boyut otomatik seçilir.
   * Mobilde küçük resim, masaüstünde büyük resim yüklenir.
   */
  urls?: ResponsiveUrls;
  /**
   * CSS sizes attribute — tarayıcıya hangi boyutta gösterilecegini söyler.
   * Varsayılan: "(max-width: 480px) 480px, (max-width: 900px) 900px, 1600px"
   */
  sizes?: string;
}

const DEFAULT_SIZES =
  "(max-width: 480px) 480px, (max-width: 900px) 900px, 1600px";

export default function LazyImage({
  src,
  alt,
  className = "",
  style,
  width,
  height,
  fallback = "/placeholder.svg",
  urls,
  sizes = DEFAULT_SIZES,
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!imgRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin: "200px", threshold: 0.01 }
    );

    observer.observe(imgRef.current);
    return () => observer.disconnect();
  }, []);

  // srcset olustur — Cloudinary responsive URL'leri varsa kullan
  const srcSet = urls
    ? [
        `${urls.mobile} 480w`,
        `${urls.tablet} 900w`,
        `${urls.desktop} 1600w`,
      ].join(", ")
    : undefined;

  // gösterilecek src — hata varsa fallback
  const displaySrc = hasError ? fallback : src;

  return (
    <div
      ref={imgRef}
      className={`relative overflow-hidden ${className}`}
      style={{ width, height, ...style }}
    >
      {/* Skeleton — resim yüklenene kadar */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-zinc-800 animate-pulse" />
      )}

      {isInView && (
        <img
          src={displaySrc}
          srcSet={srcSet}
          sizes={srcSet ? sizes : undefined}
          alt={alt}
          width={width}
          height={height}
          loading="lazy"
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          onError={() => {
            setHasError(true);
            setIsLoaded(true);
          }}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
        />
      )}
    </div>
  );
}
