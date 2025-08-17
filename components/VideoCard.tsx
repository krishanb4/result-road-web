// components/VideoCard.tsx
"use client";
import { Card } from "../components/ui";

export default function VideoCard({
  title,
  src,
}: {
  title: string;
  src: string;
}) {
  return (
    <Card className="overflow-hidden p-0">
      <div className="aspect-video w-full">
        {/* Self-hosted mp4 or YouTube embed URL */}
        {src.includes("youtube.com") || src.includes("youtu.be") ? (
          <iframe
            className="h-full w-full"
            src={src}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <video
            className="h-full w-full"
            src={src}
            controls
            preload="metadata"
          />
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-white">{title}</h3>
        <p className="text-sm text-white/70">
          Watch this orientation before using the dashboard.
        </p>
      </div>
    </Card>
  );
}
