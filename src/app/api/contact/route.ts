import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body: ContactFormData = await request.json();
    
    // Validate required fields
    if (!body.name || !body.email || !body.subject || !body.message) {
      return NextResponse.json(
        { error: 'Todos los campos son obligatorios' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'El formato del email no es válido' },
        { status: 400 }
      );
    }

    // Check if Resend API key is configured
    if (!process.env.RESEND_API_KEY) {
      console.error('❌ RESEND_API_KEY no está configurada');
      return NextResponse.json(
        { error: 'Configuración de email no disponible' },
        { status: 500 }
      );
    }

    // Send email using Resend
    try {
      const { data, error } = await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'noreply@mejorprecio.com',
        to: process.env.RESEND_TO_EMAIL || 'info@mejorprecio.com',
        subject: `Contacto: ${body.subject}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
              Nuevo Mensaje de Contacto
            </h2>
            
            <div style="background-color: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 5px;">
              <p style="margin: 10px 0;"><strong>Nombre:</strong> ${body.name}</p>
              <p style="margin: 10px 0;"><strong>Email:</strong> ${body.email}</p>
              <p style="margin: 10px 0;"><strong>Asunto:</strong> ${body.subject}</p>
            </div>
            
            <div style="margin: 20px 0;">
              <h3 style="color: #333;">Mensaje:</h3>
              <div style="background-color: #ffffff; padding: 15px; border: 1px solid #dee2e6; border-radius: 5px;">
                ${body.message.replace(/\n/g, '<br>')}
              </div>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6; color: #6c757d; font-size: 12px;">
              <p>Este mensaje fue enviado desde el formulario de contacto de Mejor Precio</p>
              <p>Fecha: ${new Date().toLocaleString('es-MX', { timeZone: 'America/Mexico_City' })}</p>
            </div>
          </div>
        `,
        replyTo: body.email
      });

      if (error) {
        console.error('❌ Error de Resend:', error);
        return NextResponse.json(
          { error: 'Error al enviar el email' },
          { status: 500 }
        );
      }

      console.log('✅ Email enviado exitosamente:', data);

      return NextResponse.json(
        { 
          message: 'Mensaje enviado exitosamente',
          success: true 
        },
        { status: 200 }
      );

    } catch (emailError) {
      console.error('❌ Error al enviar email:', emailError);
      return NextResponse.json(
        { error: 'Error al enviar el email' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('❌ Error al procesar mensaje de contacto:', error);
    
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}