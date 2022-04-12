import React from 'react';
import hero from '../assets/hero.png';

export default function HeroImage() {
  return (
    <img
      src={hero}
      alt="*HYPEHAUS"
      className="w-full max-w-xs mx-auto aspect-square rounded-2xl sm:w-2/3"
    />
  );
}
