import CloudinaryImage from "@/features/shared/components/CloudinaryImage";
import type { ClassroomPhoto } from "@/features/rooms/services/roomService";
import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/features/shared/ui/carousel";

export default function RoomPhotoGallery({
  photos,
}: {
  photos: ClassroomPhoto[] | null;
}) {
  if (!photos || photos.length === 0) {
    return null;
  }

  return (
    <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <Carousel opts={{ loop: photos.length > 1 }} className="w-full">
        <CarouselContent className="ml-0">
          {photos.map((photo, index) => (
            <CarouselItem key={`${photo.src}-${index}`} className="pl-0">
              <div className="relative h-72 bg-slate-200 sm:h-96 lg:h-[30rem]">
                <CloudinaryImage
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  priority={index === 0}
                  crop={{
                    type: "fill",
                    gravity: "center",
                  }}
                  format="webp"
                  quality="auto"
                  sizes="(min-width: 1024px) 1200px, 100vw"
                  className="object-cover"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {photos.length > 1 ? (
          <div className="absolute inset-y-0 left-0 right-0 pointer-events-none">
            <CarouselPrevious className="pointer-events-auto left-4 border-white/70 bg-white/90 text-slate-800 hover:bg-white" />
            <CarouselNext className="pointer-events-auto right-4 border-white/70 bg-white/90 text-slate-800 hover:bg-white" />
          </div>
        ) : null}

        <CarouselDots className="absolute bottom-5 left-1/2 z-10 -translate-x-1/2" />
      </Carousel>
    </section>
  );
}
