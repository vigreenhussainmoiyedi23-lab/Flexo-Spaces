import { useState } from "react";

export default function BlurImage({
  lowQualitySrc,
  highQualitySrc,
  alt,
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative overflow-hidden">
      {/* Blurry Placeholder */}
      <img
        src={lowQualitySrc}
        alt={alt}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
          loaded ? "opacity-0" : "opacity-100 blur-xl scale-110"
        }`}
      />

      {/* Full Image */}
      <img
        src={highQualitySrc}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className={`w-full h-full object-cover transition-all duration-700 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}