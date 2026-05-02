import CloudinaryImage from "@/features/shared/components/CloudinaryImage";
import type { ClassroomPhoto } from "@/features/rooms/services/roomService";
import { getRoomImageDeliveryProps } from "@/features/rooms/lib/roomImages";
import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/features/shared/ui/carousel";

export default function ImageCarousel({
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
              <div className="relative h-56 bg-slate-200 sm:h-80 lg:h-[30rem]">
                <CloudinaryImage
                  src={photo.src}
                  alt={photo.alt}
                  priority={index === 0}
                  {...getRoomImageDeliveryProps("carousel")}
                  className="size-full object-cover"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {photos.length > 1 ? (
          <div className="pointer-events-none absolute inset-y-0 right-0 left-0">
            <CarouselPrevious className="pointer-events-auto left-2 border-white/70 bg-white/90 text-slate-800 hover:bg-white sm:left-4" />
            <CarouselNext className="pointer-events-auto right-2 border-white/70 bg-white/90 text-slate-800 hover:bg-white sm:right-4" />
          </div>
        ) : null}

        <CarouselDots className="absolute bottom-3 left-1/2 z-10 -translate-x-1/2 sm:bottom-5" />
      </Carousel>
    </section>
  );
}
