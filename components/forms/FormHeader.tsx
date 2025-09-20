import React from 'react';
import Image from 'next/image';
import Container from '../layout/Container';


const FormHeader: React.FC = () => {
  return (
    <div className="w-full bg-alma-lime py-8 px-6">
      <Container>
      <div className="flex items-start justify-start gap-2">
        {/* Circles column */}
        <div className="relative w-48 h-48">
          <div className="absolute top-8 left-8 w-24 h-24 bg-alma-lime-dark/70 rounded-full shadow-lg"></div>
          {/* Top left corner */}
          <div className="absolute top-0 left-0 w-16 h-16 bg-alma-lime-dark/50 rounded-full shadow-lg"></div>
          {/* Below that, lighter */}
          <div className="absolute top-20 left-0 w-20 h-20 bg-white/50 rounded-full shadow-lg"></div>
        </div>
        
        {/* Logo and text column */}
        <div className="flex flex-col items-start justify-start">
          <Image
            src="/alma.png"
            alt="Alma Logo"
            width={120}
            height={40}
            className="h-10 w-auto mb-6"
            priority
          />
          <h2 className="text-4xl font-bold text-black leading-tight">
            Get An Assessment<br />
            Of Your Immigration Case
          </h2>
        </div>
      </div>
      </Container>
    </div>
  );
};

export default FormHeader;
