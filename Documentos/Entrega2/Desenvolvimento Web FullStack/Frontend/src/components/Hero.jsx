import { useState, useEffect } from 'react';

const slides = [
  {
    eyebrow: 'DESTAQUE DA SEMANA',
    title: 'Seleção Premium de Nozes',
    text: 'Castanhas e nozes frescas direto dos fornecedores. Aproveite ofertas exclusivas no marketplace.',
    image:
      'https://images.unsplash.com/photo-1599599810694-b5ac4dd3e3d7?w=1600&q=80',
    alt: 'Nozes em tigelas rústicas',
    cta: 'Ver Coleção',
  },
  {
    eyebrow: 'OFERTA ESPECIAL',
    title: 'Amêndoas Orgânicas',
    text: 'Certificadas organicamente, com qualidade premium e entrega rápida.',
    image:
      'https://images.unsplash.com/photo-1585329217456-c1a0ead25cb5?w=1600&q=80',
    alt: 'Amêndoas frescas',
    cta: 'Comprar Agora',
  },
  {
    eyebrow: 'NOVO PRODUTO',
    title: 'Mix de Castanhas Gourmet',
    text: 'Blend exclusivo com os melhores sabores. Perfeito para eventos e presentes.',
    image:
      'https://images.unsplash.com/photo-1583259013994-d52df80fdf78?w=1600&q=80',
    alt: 'Mix de castanhas',
    cta: 'Explorar',
  },
];

export default function Hero({ onCTAClick }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const goToSlide = (index) => {
    setCurrentSlide(index % slides.length);
  };

  const goNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const goPrev = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    const timer = setInterval(goNext, 5000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[currentSlide];

  return (
    <section className="mb-12">
      <div className="relative h-96 bg-marketplace-paper rounded-3xl overflow-hidden">
        {/* Background Image with Overlay */}
        <img
          src={slide.image}
          alt={slide.alt}
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent"></div>

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16 z-10">
          <span className="text-marketplace-gold text-xs font-bold tracking-wider mb-4 max-w-md">
            {slide.eyebrow}
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 max-w-2xl leading-tight">
            {slide.title}
          </h1>
          <p className="text-white/80 text-lg mb-8 max-w-md">{slide.text}</p>
          <button
            onClick={() => onCTAClick?.()}
            className="bg-marketplace-gold text-marketplace-ink font-bold py-3 px-8 rounded-lg w-fit hover:bg-marketplace-gold/90 transition-colors shadow-lg"
          >
            {slide.cta}
          </button>
        </div>

        {/* Controls */}
        <div className="absolute bottom-8 left-0 right-0 z-20 flex items-center justify-between px-8">
          <button
            onClick={goPrev}
            className="w-10 h-10 rounded-full bg-white text-marketplace-ink flex items-center justify-center hover:bg-white/90 transition-colors shadow-lg"
            aria-label="Previous slide"
          >
            ‹
          </button>

          <div className="flex gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentSlide ? 'bg-marketplace-gold' : 'bg-white/50'
                }`}
              />
            ))}
          </div>

          <button
            onClick={goNext}
            className="w-10 h-10 rounded-full bg-white text-marketplace-ink flex items-center justify-center hover:bg-white/90 transition-colors shadow-lg"
            aria-label="Next slide"
          >
            ›
          </button>
        </div>
      </div>
    </section>
  );
}
