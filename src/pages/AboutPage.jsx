import React from 'react';

function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-black">Nuestra Historia...</h1>
      
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md mb-8 border-t-4 border-utsa-orange">
        <p className="mb-4 text-utsa-blue">
        La historia de Escala 1:1 S.A.S comenzó en el año 2025, cuando cuatro jóvenes estudiantes de Delineante de Arquitectura e Ingeniería de la Universidad Colegio Mayor de Cundinamarca identificaron una oportunidad única en el mercado de la arquitectura y el diseño. Durante su tiempo en la universidad, específicamente en el componente de Introducción a la Administración, los cuatro compañeros se adentraron en el mundo del emprendimiento y comenzaron a pensar en maneras de conectar su pasión por la arquitectura con una necesidad real en el mercado.
        La idea de crear la empresa comenzó a tomar forma cuando se dieron cuenta de que los estudiantes y profesionales de la arquitectura, ingeniería y diseño no contaban con opciones de merchandising que no solo representarán su disciplina, sino que también estuvieran alineadas con valores cada vez más relevantes, como la sostenibilidad y la conciencia ecológica. Estos valores, fundamentales dentro del ámbito académico y profesional, no estaban siendo considerados por la mayoría de las marcas de productos para esta comunidad.
        Al identificar este vacío, los cuatro jóvenes decidieron fundar Escala 1:1, una empresa que no sólo ofreciera productos exclusivos de merchandising para los amantes de la arquitectura, sino que también se comprometa con el respeto al medio ambiente. Así, la marca comenzó a desarrollarse bajo una visión clara: crear artículos de alta calidad, como camisetas, pines, bolsos y otros accesorios, personalizados y sostenibles, con diseños arquitectónicos y de ingeniería que reflejaran tanto la creatividad como la responsabilidad ambiental.
        </p>
      </div>

      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md border-t-4 border-utsa-blue">
        <h2 className="text-2xl font-semibold mb-4 text-utsa-blue">Contáctanos</h2>
        <p className="mb-4 text-utsa-blue">
        ¿Tienes preguntas, sugerencias o necesitas ayuda? Comunícate con nuestro equipo a:
        </p>
        <p className="font-semibold text-black">soporte@escala.com</p>
      </div>
    </div>
  );
}

export default AboutPage; 