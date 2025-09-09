import { getTranslations } from 'next-intl/server';

export default async function ContactPage() {
  const t = await getTranslations('contact');
  console.debug('🚀 [ContactPage] Initializing with t:', t);

  return (
    <div className="mx-auto max-w-4xl p-6 my-6">
      <h1 className="text-3xl text-accent mb-8 highlight-primary">Contact Us</h1>

      <div className="space-y-8">
        <section className="space-y-4">
          <h2 className="text-xl text-accent mb-4 highlight-secondary">Get In Touch</h2>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 leading-relaxed mb-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
              exercitation ullamco laboris.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident.
            </p>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section className="space-y-6">
            <h2 className="text-xl text-accent mb-4 highlight-secondary">Contact Information</h2>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center mt-1">
                  <span className="text-secondary text-xs font-bold">📍</span>
                </div>
                <div>
                  <h3 className="font-semibold text-accent">Address</h3>
                  <p className="text-gray-700">
                    Lorem Ipsum Street, 123
                    <br />
                    Dolor Sit Amet City, 45678
                    <br />
                    Consectetur Country
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center mt-1">
                  <span className="text-secondary text-xs font-bold">📧</span>
                </div>
                <div>
                  <h3 className="font-semibold text-accent">Email</h3>
                  <p className="text-gray-700">
                    info@mejorprecio.com
                    <br />
                    support@mejorprecio.com
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center mt-1">
                  <span className="text-secondary text-xs font-bold">📞</span>
                </div>
                <div>
                  <h3 className="font-semibold text-accent">Phone</h3>
                  <p className="text-gray-700">
                    +1 (555) 123-4567
                    <br />
                    +1 (555) 987-6543
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center mt-1">
                  <span className="text-secondary text-xs font-bold">⏰</span>
                </div>
                <div>
                  <h3 className="font-semibold text-accent">Business Hours</h3>
                  <p className="text-gray-700">
                    Monday - Friday: 9:00 AM - 6:00 PM
                    <br />
                    Saturday: 10:00 AM - 4:00 PM
                    <br />
                    Sunday: Closed
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-xl text-accent mb-4 highlight-secondary">Send us a Message</h2>

            <div className="bg-white rounded-lg border border-secondary/20 p-6 shadow-sm">
              <form className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-accent mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Lorem Ipsum"
                    className="w-full px-3 py-2 border border-secondary/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-accent mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="lorem@example.com"
                    className="w-full px-3 py-2 border border-secondary/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-accent mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    placeholder="Lorem ipsum dolor sit amet"
                    className="w-full px-3 py-2 border border-secondary/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-accent mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua..."
                    className="w-full px-3 py-2 border border-secondary/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary text-secondary font-medium py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  Send Message
                </button>
              </form>
            </div>
          </section>
        </div>

        <section className="space-y-4">
          <h2 className="text-xl text-accent mb-4 highlight-secondary">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <div className="bg-white rounded-lg border border-secondary/20 p-4 shadow-sm">
              <h3 className="font-semibold text-accent mb-2">Lorem ipsum dolor sit amet?</h3>
              <p className="text-gray-700 text-sm">
                Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
                magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco.
              </p>
            </div>
            <div className="bg-white rounded-lg border border-secondary/20 p-4 shadow-sm">
              <h3 className="font-semibold text-accent mb-2">Sed do eiusmod tempor incididunt?</h3>
              <p className="text-gray-700 text-sm">
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
                fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.
              </p>
            </div>
            <div className="bg-white rounded-lg border border-secondary/20 p-4 shadow-sm">
              <h3 className="font-semibold text-accent mb-2">Ut enim ad minim veniam?</h3>
              <p className="text-gray-700 text-sm">
                Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                Sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
