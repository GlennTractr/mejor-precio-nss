import { getTranslations } from 'next-intl/server';

export default async function PrivacyPolicyPage() {
  const t = await getTranslations('privacy');
  console.debug('🚀 [PrivacyPolicyPage] Initializing with t:', t);

  return (
    <div className="mx-auto max-w-4xl p-6 my-6">
      <h1 className="text-3xl text-accent mb-8 highlight-secondary">Política de Privacidad</h1>

      <div className="space-y-8">
        <section className="space-y-4">
          <p className="text-gray-600 text-sm mb-6">
            <strong>Última actualización:</strong> 16 de septiembre de 2025
          </p>

          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 leading-relaxed">
              En SaveOnBaby, nos comprometemos a proteger la privacidad y los datos personales de nuestros usuarios. 
              Esta Política de Privacidad describe cómo recopilamos, utilizamos, compartimos y protegemos la información 
              personal cuando utiliza nuestro sitio web de comparación de precios para productos de bebé, conforme a la Ley Federal de Protección 
              de Datos Personales en Posesión de los Particulares (LFPDPPP) de México.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-accent mb-4">1. Información que Recopilamos</h2>
          <div className="prose prose-gray max-w-none space-y-4">
            <h3 className="text-lg font-medium text-accent">1.1 Información Personal</h3>
            <p className="text-gray-700 leading-relaxed">
              Recopilamos información personal que usted nos proporciona directamente cuando se registra en SaveOnBaby, 
              crea una cuenta, se suscribe a nuestras alertas de precios para productos de bebé, o se comunica con nosotros. Esta información puede incluir:
            </p>

            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Nombre completo y dirección de correo electrónico</li>
              <li>Número de teléfono (opcional)</li>
              <li>Preferencias de productos para bebé y categorías de interés</li>
              <li>Historial de búsquedas de productos para bebé y productos favoritos</li>
            </ul>

            <h3 className="text-lg font-medium text-accent">1.2 Datos de Uso</h3>
            <p className="text-gray-700 leading-relaxed">
              Automáticamente recopilamos cierta información cuando utiliza nuestro sitio web, incluyendo:
            </p>

            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Dirección IP y ubicación geográfica aproximada</li>
              <li>Tipo de navegador y dispositivo utilizado</li>
              <li>Páginas visitadas y tiempo de permanencia</li>
              <li>Términos de búsqueda y patrones de navegación</li>
            </ul>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-accent mb-4">2. Cómo Utilizamos su Información</h2>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 leading-relaxed mb-4">
              Utilizamos la información recopilada para los siguientes propósitos legítimos:
            </p>

            <div className="bg-gray-50 border-l-4 border-primary p-4 my-4">
              <p className="text-gray-700">
                <strong>Importante:</strong> Todos los tratamientos de datos personales se realizan con base en el 
                consentimiento expreso del titular o en alguna de las excepciones previstas en la LFPDPPP.
              </p>
            </div>

            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Proporcionar y mejorar nuestros servicios de comparación de precios para productos de bebé</li>
              <li>Personalizar la experiencia del usuario y las recomendaciones de productos para bebé</li>
              <li>Enviar alertas de precios y notificaciones relevantes</li>
              <li>Comunicarnos con usted sobre actualizaciones del servicio</li>
              <li>Analizar el uso del sitio para mejorar nuestros servicios</li>
              <li>Cumplir con obligaciones legales y regulatorias</li>
            </ul>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-accent mb-4">3. Compartir y Divulgación de Datos</h2>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 leading-relaxed mb-4">
              No vendemos, alquilamos ni compartimos su información personal con terceros para fines comerciales. 
              Podemos compartir información en las siguientes circunstancias limitadas:
            </p>

            <h3 className="text-lg font-medium text-accent">3.1 Proveedores de Servicios</h3>
            <p className="text-gray-700 leading-relaxed">
              Compartimos información con proveedores de servicios de confianza que nos ayudan a operar nuestro sitio web, 
              incluyendo servicios de hosting, análisis web, y envío de correos electrónicos. Estos proveedores están 
              contractualmente obligados a proteger su información.
            </p>

            <h3 className="text-lg font-medium text-accent">3.2 Requerimientos Legales</h3>
            <p className="text-gray-700 leading-relaxed">
              Podemos divulgar su información personal cuando sea requerido por ley, orden judicial, o por autoridades 
              gubernamentales competentes, o cuando sea necesario para proteger nuestros derechos legales.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-accent mb-4">4. Seguridad de los Datos</h2>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 leading-relaxed mb-4">
              Implementamos medidas de seguridad técnicas, físicas y administrativas apropiadas para proteger 
              su información personal contra acceso no autorizado, alteración, divulgación o destrucción.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg border border-secondary/20 p-4 shadow-sm">
                <h4 className="font-semibold text-accent mb-2">Cifrado</h4>
                <p className="text-gray-700 text-sm">
                  Utilizamos cifrado SSL/TLS para proteger la transmisión de datos sensibles entre su dispositivo y nuestros servidores.
                </p>
              </div>
              <div className="bg-white rounded-lg border border-secondary/20 p-4 shadow-sm">
                <h4 className="font-semibold text-accent mb-2">Control de Acceso</h4>
                <p className="text-gray-700 text-sm">
                  Limitamos el acceso a información personal solo al personal autorizado que necesita esta información para cumplir sus funciones.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-accent mb-4">5. Sus Derechos (Derechos ARCO)</h2>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 leading-relaxed mb-4">
              Conforme a la LFPDPPP, usted tiene los siguientes derechos sobre sus datos personales, 
              conocidos como derechos ARCO:
            </p>

            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>
                <strong>Acceso:</strong> Conocer qué datos personales tenemos sobre usted y los propósitos de su uso
              </li>
              <li>
                <strong>Rectificación:</strong> Solicitar la corrección de datos incorrectos o incompletos
              </li>
              <li>
                <strong>Cancelación:</strong> Solicitar la eliminación de sus datos personales de nuestros registros
              </li>
              <li>
                <strong>Oposición:</strong> Oponerse al tratamiento de sus datos para propósitos específicos
              </li>
              <li>
                <strong>Revocación del Consentimiento:</strong> Retirar su consentimiento para el tratamiento de datos
              </li>
            </ul>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-accent mb-4">6. Cookies y Tecnologías de Seguimiento</h2>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 leading-relaxed mb-4">
              Utilizamos cookies y tecnologías similares para mejorar su experiencia en SaveOnBaby, 
              analizar el tráfico y personalizar las recomendaciones de productos para bebé. Puede controlar las cookies a través de la 
              configuración de su navegador.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300 text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-4 py-2 text-left font-medium text-accent">
                      Tipo de Cookie
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left font-medium text-accent">
                      Propósito
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left font-medium text-accent">
                      Duración
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">Esenciales</td>
                    <td className="border border-gray-300 px-4 py-2">Funcionalidad básica del sitio</td>
                    <td className="border border-gray-300 px-4 py-2">Sesión</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">Analíticas</td>
                    <td className="border border-gray-300 px-4 py-2">Análisis de uso y mejoras</td>
                    <td className="border border-gray-300 px-4 py-2">30 días</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">Preferencias</td>
                    <td className="border border-gray-300 px-4 py-2">Personalización de contenido</td>
                    <td className="border border-gray-300 px-4 py-2">90 días</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-accent mb-4">7. Actualizaciones de esta Política</h2>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 leading-relaxed">
              SaveOnBaby puede actualizar esta Política de Privacidad ocasionalmente para reflejar cambios en nuestras 
              prácticas de información o en la legislación aplicable. Le notificaremos sobre cambios significativos 
              mediante aviso en nuestro sitio web o por correo electrónico. La fecha de la última actualización 
              se muestra en la parte superior de esta política.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-accent mb-4">8. Contacto</h2>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 leading-relaxed mb-4">
              Si tiene preguntas sobre esta Política de Privacidad de SaveOnBaby o desea ejercer sus derechos ARCO, 
              puede contactarnos a través de los siguientes medios:
            </p>

            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="space-y-2">
                <p className="text-gray-700">
                  <strong>Responsable del Tratamiento:</strong> SaveOnBaby México
                </p>
                <p className="text-gray-700">
                  <strong>Email:</strong> privacidad@saveonbaby.mx
                </p>
                <p className="text-gray-700">
                  <strong>Dirección:</strong> Ciudad de México, México
                </p>
                <p className="text-gray-700">
                  <strong>Atención:</strong> Lunes a Viernes, 9:00 - 18:00 hrs (GMT-6)
                </p>
              </div>
            </div>

            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-gray-700 text-sm">
                <strong>Jurisdicción:</strong> Esta Política de Privacidad se rige por las leyes de México. 
                Cualquier disputa relacionada con el tratamiento de datos personales será resuelta conforme 
                a la legislación mexicana aplicable y ante los tribunales competentes de México.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
