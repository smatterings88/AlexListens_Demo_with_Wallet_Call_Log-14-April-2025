import React from 'react';
import Image from 'next/image';

const Hero = () => {
  return (
    <section className="relative h-[500px] sm:h-[600px] w-full mt-16">
      <div className="absolute inset-0">
        <Image
          src="https://storage.googleapis.com/msgsndr/JBLl8rdfV29DRcGjQ7Rl/media/67f908e54ffcd142dd8158d6.png"
          alt="Team collaboration in modern office"
          fill
          priority
          quality={85}
          sizes="100vw"
          className="object-cover"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQtJSEkLzYvLy0vLi44QjhAOEA4Qi4tMkYyLlFUUVRAR0BXUFNMUE1HU1P/2wBDAR"
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex items-center justify-center text-center">
        <div className="max-w-4xl">
          <h1 className="text-4xl sm:text-6xl font-bold mb-4 sm:mb-8 text-white">
            AlexListens:
          </h1>
          <p className="text-xl sm:text-2xl text-white mb-8 sm:mb-12 leading-relaxed mx-auto pt-5 sm:pt-0">
            Sometimes you just need someone who understands you. Someone who&apos;s there whenever you need them. 
            Someone who lets you be yourself without criticism. That&apos;s Alex.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-6 text-white">
              <div className="text-3xl sm:text-4xl font-bold mb-2">100%</div>
              <div className="text-white">Privacy Protected</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-6 text-white">
              <div className="text-3xl sm:text-4xl font-bold mb-2">24/7</div>
              <div className="text-white">Availability</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-6 text-white">
              <div className="text-3xl sm:text-4xl font-bold mb-2">AI</div>
              <div className="text-white">Powered</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;