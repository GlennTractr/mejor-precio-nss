import { getTranslations } from 'next-intl/server';

export default async function AboutPage() {
  const t = await getTranslations('about');
  console.debug('🚀 [AboutPage] Initializing with t:', t);

  return (
    <div className="mx-auto max-w-4xl p-6 my-6">
      <h1 className="text-3xl text-accent mb-8 highlight-primary">Acerca de Nosotros</h1>

      <div className="space-y-8">
        <section className="space-y-4">
          <h2 className="text-xl text-accent mb-4 highlight-secondary">Nuestra Historia</h2>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 leading-relaxed mb-4">
              Somos una <strong>familia</strong> franco-mexicana con 3 hijos, incluyendo gemelas.
              Después del nacimiento de nuestras gemelas, luchamos para encontrar las mejores
              opciones de productos para bebés.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Después de esta mala experiencia, decidimos crear este sitio web para{' '}
              <strong>ayudar</strong> a cada <strong>familia</strong> mexicana a encontrar el mejor
              producto al mejor precio.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl text-accent mb-4 highlight-secondary">Nuestra Misión</h2>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 leading-relaxed mb-4">
              Creemos en la importancia de la <strong>proximidad</strong> con nuestras{' '}
              <strong>familias</strong> mexicanas. Entendemos los desafíos que enfrentan los padres
              al <strong>buscar</strong> productos de calidad para sus hijos a precios accesibles.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Nuestra misión es ofrecer <strong>descuentos</strong> excepcionales y facilitar la{' '}
              <strong>búsqueda</strong> de los mejores productos para bebés y niños.
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>
                <strong>Búsqueda</strong> inteligente de productos con los mejores{' '}
                <strong>descuentos</strong>
              </li>
              <li>
                <strong>Ayuda</strong> personalizada para encontrar exactamente lo que necesitas
              </li>
              <li>
                <strong>Proximidad</strong> con <strong>familias</strong> mexicanas que comparten
                experiencias similares
              </li>
              <li>
                Comparación de precios para garantizar el mejor <strong>descuento</strong> posible
              </li>
            </ul>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl text-accent mb-4 highlight-secondary">
            ¿Por Qué Elegir Mejor Precio?
          </h2>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 leading-relaxed mb-4">
              Como <strong>familia</strong>, entendemos las necesidades reales de los padres
              mexicanos. Nuestra <strong>proximidad</strong> con la comunidad nos permite ofrecer{' '}
              <strong>ayuda</strong> verdaderamente útil y relevante.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Facilitamos la <strong>búsqueda</strong> de productos mediante herramientas intuitivas
              que ahorran tiempo y garantizan los mejores <strong>descuentos</strong> para tu{' '}
              <strong>familia</strong>.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl text-accent mb-4 highlight-secondary">Nuestros Valores</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="font-semibold text-accent">Familia</h3>
              <p className="text-gray-700 text-sm">
                Entendemos las necesidades de las <strong>familias</strong> porque somos una{' '}
                <strong>familia</strong>. Cada decisión está pensada en <strong>ayudar</strong> a
                otras <strong>familias</strong> como la nuestra.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-accent">Proximidad</h3>
              <p className="text-gray-700 text-sm">
                Mantenemos una relación cercana con nuestros usuarios, ofreciendo{' '}
                <strong>ayuda</strong>
                personalizada y comprensión de sus necesidades específicas.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-accent">Descuentos</h3>
              <p className="text-gray-700 text-sm">
                Nos comprometemos a encontrar los mejores <strong>descuentos</strong> para que las
                <strong>familias</strong> accedan a productos de calidad sin comprometer su
                presupuesto.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-accent">Búsqueda y Ayuda</h3>
              <p className="text-gray-700 text-sm">
                Facilitamos la <strong>búsqueda</strong> con herramientas intuitivas y brindamos{' '}
                <strong>ayuda</strong>
                para que cada <strong>familia</strong> tome las mejores decisiones de compra.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
