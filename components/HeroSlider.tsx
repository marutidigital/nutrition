'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Slide {
  image: string
  mobileImage?: string
  alt: string
  href: string
  badge?: string
}

const slides: Slide[] = [
  {
    image: '/imgi_59_4418711619_May26GetReadyforSummerSale_Ecomm_HPH_3_DSK.jpg',
    mobileImage: '/imgi_20_4418711619_May26GetReadyforSummerSale_Ecomm_HPH_3_MOB (1).jpg',
    alt: 'Buy 1 Get 1 50% Off Summer Sale',
    href: '/products?badge=sale',
  },
  {
    image: '/imgi_59_4418711619_May26GetReadyforSummerSale_Ecomm_HPH_3_DSK.jpg',
    mobileImage: '/imgi_20_4418711619_May26GetReadyforSummerSale_Ecomm_HPH_3_MOB (1).jpg',
    alt: 'Summer Sale Placeholder 2',
    href: '/products?badge=sale',
  },
  {
    image: '/imgi_59_4418711619_May26GetReadyforSummerSale_Ecomm_HPH_3_DSK.jpg',
    mobileImage: '/imgi_20_4418711619_May26GetReadyforSummerSale_Ecomm_HPH_3_MOB (1).jpg',
    alt: 'Summer Sale Placeholder 3',
    href: '/products?badge=sale',
  },
]

export function HeroSlider() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }

  useEffect(() => {
    resetTimeout()
    if (!isPaused) {
      timeoutRef.current = setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex === slides.length - 1 ? 0 : prevIndex + 1))
      }, 4000)
    }
    return () => resetTimeout()
  }, [currentIndex, isPaused])

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? slides.length - 1 : prevIndex - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === slides.length - 1 ? 0 : prevIndex + 1))
  }

  const goToSlide = (slideIndex: number) => {
    setCurrentIndex(slideIndex)
  }

  return (
    <div className="max-w-[1400px] mx-auto px-0 sm:px-4 mt-4 mb-8">
      <div 
        className="relative w-full overflow-hidden group rounded-none sm:rounded-md"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div 
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <div key={index} className="w-full flex-shrink-0">
              <Link href={slide.href} className="block relative w-full hover:opacity-95 transition-opacity">
                <Image
                  src={slide.image}
                  alt={slide.alt}
                  width={1400}
                  height={460}
                  className={`w-full h-auto object-cover object-center ${slide.mobileImage ? 'hidden sm:block' : 'block'}`}
                  priority={index === 0}
                />
                {slide.mobileImage && (
                  <Image
                    src={slide.mobileImage}
                    alt={slide.alt}
                    width={750}
                    height={850}
                    className="w-full h-auto object-cover object-center block sm:hidden"
                    priority={index === 0}
                  />
                )}
              </Link>
            </div>
          ))}
        </div>

        {/* Left Arrow */}
        <button
          onClick={goToPrevious}
          className="absolute top-1/2 left-2 sm:left-4 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-black/30 hover:bg-black/50 text-white transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100 z-10"
          aria-label="Previous slide"
        >
          <ChevronLeft size={24} />
        </button>

        {/* Right Arrow */}
        <button
          onClick={goToNext}
          className="absolute top-1/2 right-2 sm:right-4 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-black/30 hover:bg-black/50 text-white transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100 z-10"
          aria-label="Next slide"
        >
          <ChevronRight size={24} />
        </button>

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
          {slides.map((_, slideIndex) => (
            <button
              key={slideIndex}
              onClick={() => goToSlide(slideIndex)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                currentIndex === slideIndex
                  ? 'bg-white scale-125'
                  : 'bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Go to slide ${slideIndex + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
