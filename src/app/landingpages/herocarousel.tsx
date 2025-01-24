"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

const HeroCarousel = () => {
  const images = [
    { src: "/torogozlogo.png", alt: "Torogoz Logo" },
    { src: "/institucion.png", alt: "Institution" },
    { src: "/persona.png", alt: "Individuals" },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Memorizar la función handleNext
  const handleNext = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  }, [images.length]);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };



  // Cambiar automáticamente de imagen cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 3000); // Cambiar cada 3 segundos

    return () => clearInterval(interval); // Limpiar intervalo al desmontar
  }, [handleNext]);

  
  return (
    <div className="relative w-full h-screen bg-white overflow-hidden flex items-center justify-center">
      {/* Imágenes del carrusel */}
      {images.map((image, index) => (
        <div
          key={index}
          className={`absolute top-0 left-0 w-full h-full flex items-center justify-center transition-opacity duration-1000 ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={image.src}
            alt={image.alt}
            width={750}
            height={750}
            className="object-contain"
          />
        </div>
      ))}

      {/* Botón Anterior */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white p-2 rounded-full hover:bg-gray-800 transition"
      >
        ❮
      </button>

      {/* Botón Siguiente */}
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white p-2 rounded-full hover:bg-gray-800 transition"
      >
        ❯
      </button>

      {/* Indicadores */}
      <div className="absolute bottom-4 flex justify-center items-center gap-2">
        {images.map((_, index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-full ${
              index === currentIndex ? "bg-violet-600" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
