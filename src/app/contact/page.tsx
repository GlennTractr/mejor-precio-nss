'use client';

import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function ContactPage() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
        });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl p-6 my-6">
      <h1 className="text-3xl text-accent mb-8 highlight-primary">Contáctanos</h1>

      <div className="space-y-8">
        <section className="space-y-4">
          <h2 className="text-xl text-accent mb-4 highlight-secondary">Ponte en Contacto</h2>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 leading-relaxed mb-4">
              ¿Tienes alguna pregunta sobre nuestros productos? ¿Necesitas ayuda para encontrar el
              mejor precio? Estamos aquí para ayudarte. Como familia, entendemos tus necesidades y
              queremos brindarte el mejor servicio posible.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Contáctanos y te responderemos lo antes posible. Nuestro objetivo es ayudar a cada
              familia mexicana a encontrar los mejores productos al mejor precio.
            </p>
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-xl text-accent mb-4 highlight-secondary">Envíanos un Mensaje</h2>

          <div className="bg-white rounded-lg border border-secondary/20 p-6 shadow-sm">
            {submitStatus === 'success' && (
              <div className="mb-4 p-3 bg-green-100 border border-green-300 text-green-700 rounded-lg">
                ¡Mensaje enviado exitosamente! Te responderemos pronto.
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg">
                Error al enviar el mensaje. Por favor, inténtalo de nuevo.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-accent mb-2">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Tu nombre completo"
                  className="w-full px-3 py-2 border border-secondary/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-accent mb-2">
                  Correo Electrónico *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="tu@email.com"
                  className="w-full px-3 py-2 border border-secondary/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-accent mb-2">
                  Asunto *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  placeholder="¿En qué podemos ayudarte?"
                  className="w-full px-3 py-2 border border-secondary/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-accent mb-2">
                  Mensaje *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  placeholder="Cuéntanos cómo podemos ayudarte..."
                  className="w-full px-3 py-2 border border-secondary/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-none"
                ></textarea>
              </div>

              <Button type="submit" variant="secondary" disabled={isSubmitting} className="w-full">
                {isSubmitting ? 'Enviando...' : 'Enviar Mensaje'}
              </Button>
            </form>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl text-accent mb-4 highlight-secondary">Preguntas Frecuentes</h2>
          <div className="space-y-4">
            <div className="bg-white rounded-lg border border-secondary/20 p-4 shadow-sm">
              <h3 className="font-semibold text-accent mb-2">
                ¿Cómo puedo encontrar el mejor precio para un producto?
              </h3>
              <p className="text-gray-700 text-sm">
                Utiliza nuestro buscador inteligente para comparar precios entre diferentes tiendas.
                Nuestro sistema encuentra automáticamente los mejores descuentos disponibles.
              </p>
            </div>
            <div className="bg-white rounded-lg border border-secondary/20 p-4 shadow-sm">
              <h3 className="font-semibold text-accent mb-2">
                ¿Los precios se actualizan en tiempo real?
              </h3>
              <p className="text-gray-700 text-sm">
                Sí, nuestros precios se actualizan regularmente para asegurar que siempre tengas la
                información más reciente y los mejores descuentos disponibles.
              </p>
            </div>
            <div className="bg-white rounded-lg border border-secondary/20 p-4 shadow-sm">
              <h3 className="font-semibold text-accent mb-2">
                ¿Puedo solicitar ayuda para encontrar un producto específico?
              </h3>
              <p className="text-gray-700 text-sm">
                ¡Por supuesto! Envíanos un mensaje describiendo lo que necesitas y te ayudaremos a
                encontrar el mejor producto al mejor precio para tu familia.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
