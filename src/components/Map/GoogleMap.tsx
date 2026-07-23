"use client";

import { PRIMARY_OFFICE } from '@/data/locations';

interface googleMapProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  className?: string;
  markerTitle?: string;
}

const googleMap = ({
  center = PRIMARY_OFFICE?.coordinates ?? { lat: 0, lng: 0 },
  zoom = PRIMARY_OFFICE?.mapZoom ?? 12,
  className = 'w-full h-96 rounded-lg',
  markerTitle = PRIMARY_OFFICE?.name ?? '',
}: googleMapProps) => {
  const src = `https://www.google.com/maps?q=${center.lat},${center.lng}&z=${zoom}&output=embed`;

  return (
    <iframe
      src={src}
      className={className}
      style={{ border: 0 }}
      allowFullScreen
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      title={markerTitle}
    />
  );
};

export default googleMap;
