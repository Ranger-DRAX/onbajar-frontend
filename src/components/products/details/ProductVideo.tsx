import { Product } from "@/types/product";

function getYouTubeEmbedUrl(url: string) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  const id = match && match[2].length === 11 ? match[2] : null;
  return id ? `https://www.youtube.com/embed/${id}` : url;
}

type Props = {
  video: Product["video"];
  title: string;
};

export default function ProductVideo({ video, title }: Props) {
  if (!video?.url) return null;

  return (
    <section className="mt-20 w-full">
      <div className="relative h-[800px] w-full overflow-hidden rounded-lg bg-gray-100">
        {video.type === "youtube" ? (
          <iframe
            src={getYouTubeEmbedUrl(video.url)}
            title={title}
            className="absolute top-0 left-0 h-full w-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <video
            src={video.url}
            className="absolute top-0 left-0 h-full w-full object-contain"
            controls
            playsInline
          />
        )}
      </div>
    </section>
  );
}
