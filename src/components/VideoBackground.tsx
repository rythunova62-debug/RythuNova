"use client";

type Props = {
  src: string;
  /** Tailwind classes for the dark/tint overlay above the video. */
  overlayClassName?: string;
};

export default function VideoBackground({
  src,
  overlayClassName = "bg-emerald-950/45",
}: Props) {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <video
        className="h-full w-full object-cover"
        src={src}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
      />
      <div className={`absolute inset-0 ${overlayClassName}`} />
    </div>
  );
}
