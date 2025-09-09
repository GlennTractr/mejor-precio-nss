import { getTranslations } from 'next-intl/server';

export default async function TermsOfServicePage() {
  const t = await getTranslations('terms');
  console.debug('🚀 [TermsOfServicePage] Initializing with t:', t);

  return (
    <div className="mx-auto max-w-4xl p-6 my-6">
      <h1 className="text-3xl text-accent mb-8 highlight-secondary">Terms of Service</h1>

      <div className="space-y-8">
        <section className="space-y-4">
          <p className="text-gray-600 text-sm mb-6">
            <strong>Last updated:</strong> Lorem ipsum dolor sit amet, 2024
          </p>

          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
              exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
              dolor in reprehenderit in voluptate velit esse cillum dolore.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-accent mb-4">1. Acceptance of Terms</h2>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 leading-relaxed mb-4">
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque
              laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi
              architecto beatae vitae dicta sunt explicabo.
            </p>

            <p className="text-gray-700 leading-relaxed">
              Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia
              consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
            </p>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-4">
              <p className="text-gray-700">
                <strong>Important:</strong> At vero eos et accusamus et iusto odio dignissimos
                ducimus qui blanditiis praesentium voluptatum deleniti.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-accent mb-4">2. Use of Service</h2>
          <div className="prose prose-gray max-w-none space-y-4">
            <h3 className="text-lg font-medium text-accent">2.1 Permitted Use</h3>
            <p className="text-gray-700 leading-relaxed">
              Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum
              soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat
              facere possimus.
            </p>

            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit</li>
              <li>Sed do eiusmod tempor incididunt ut labore et dolore</li>
              <li>Ut enim ad minim veniam, quis nostrud exercitation</li>
              <li>Duis aute irure dolor in reprehenderit in voluptate</li>
            </ul>

            <h3 className="text-lg font-medium text-accent">2.2 Prohibited Activities</h3>
            <p className="text-gray-700 leading-relaxed">
              Omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et
              aut officiis debitis aut rerum necessitatibus saepe eveniet.
            </p>

            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Consectetur adipiscing elit, sed do eiusmod</li>
              <li>Tempor incididunt ut labore et dolore magna</li>
              <li>Ut enim ad minim veniam, quis nostrud</li>
              <li>Exercitation ullamco laboris nisi ut aliquip</li>
            </ul>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-accent mb-4">3. User Accounts</h2>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 leading-relaxed mb-4">
              Et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut
              aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus
              asperiores repellat.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg border border-secondary/20 p-4 shadow-sm">
                <h4 className="font-semibold text-accent mb-2">Account Security</h4>
                <p className="text-gray-700 text-sm">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                  incididunt.
                </p>
              </div>
              <div className="bg-white rounded-lg border border-secondary/20 p-4 shadow-sm">
                <h4 className="font-semibold text-accent mb-2">Account Responsibility</h4>
                <p className="text-gray-700 text-sm">
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                  aliquip.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-accent mb-4">
            4. Content and Intellectual Property
          </h2>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 leading-relaxed mb-4">
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque
              laudantium, totam rem aperiam.
            </p>

            <h3 className="text-lg font-medium text-accent">4.1 User Content</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta
              sunt explicabo.
            </p>

            <h3 className="text-lg font-medium text-accent">4.2 Service Content</h3>
            <p className="text-gray-700 leading-relaxed">
              Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci
              velit.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-accent mb-4">5. Payment Terms</h2>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 leading-relaxed mb-4">
              Sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam
              quaerat voluptatem.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300 text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-4 py-2 text-left font-medium text-accent">
                      Service Type
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left font-medium text-accent">
                      Billing Period
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left font-medium text-accent">
                      Cancellation
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">Basic Service</td>
                    <td className="border border-gray-300 px-4 py-2">Monthly</td>
                    <td className="border border-gray-300 px-4 py-2">Anytime</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">Premium Service</td>
                    <td className="border border-gray-300 px-4 py-2">Annual</td>
                    <td className="border border-gray-300 px-4 py-2">30 days notice</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">Enterprise</td>
                    <td className="border border-gray-300 px-4 py-2">Custom</td>
                    <td className="border border-gray-300 px-4 py-2">Per agreement</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-accent mb-4">6. Disclaimers and Limitations</h2>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 leading-relaxed mb-4">
              Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit
              laboriosam, nisi ut aliquid ex ea commodi consequatur.
            </p>

            <div className="bg-red-50 border-l-4 border-red-400 p-4 my-4">
              <p className="text-gray-700">
                <strong>Disclaimer:</strong> Quis autem vel eum iure reprehenderit qui in ea
                voluptate velit esse quam nihil molestiae consequatur.
              </p>
            </div>

            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>
                <strong>Service Availability:</strong> Lorem ipsum dolor sit amet
              </li>
              <li>
                <strong>Data Accuracy:</strong> Consectetur adipiscing elit, sed do
              </li>
              <li>
                <strong>Third-party Links:</strong> Eiusmod tempor incididunt ut labore
              </li>
              <li>
                <strong>Service Interruptions:</strong> Et dolore magna aliqua ut enim
              </li>
            </ul>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-accent mb-4">7. Termination</h2>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 leading-relaxed mb-4">
              Vel illum qui dolorem eum fugiat quo voluptas nulla pariatur. At vero eos et accusamus
              et iusto odio dignissimos ducimus.
            </p>

            <p className="text-gray-700 leading-relaxed">
              Qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas
              molestias excepturi sint occaecati cupiditate non provident.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-accent mb-4">8. Governing Law</h2>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 leading-relaxed">
              Similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum
              fuga. Et harum quidem rerum facilis est et expedita distinctio.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-accent mb-4">9. Changes to Terms</h2>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 leading-relaxed">
              Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus
              id quod maxime placeat facere possimus, omnis voluptas assumenda est.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-accent mb-4">10. Contact Information</h2>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 leading-relaxed mb-4">
              Omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum
              necessitatibus saepe eveniet.
            </p>

            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="space-y-2">
                <p className="text-gray-700">
                  <strong>Legal Department:</strong> legal@mejorprecio.com
                </p>
                <p className="text-gray-700">
                  <strong>General Inquiries:</strong> support@mejorprecio.com
                </p>
                <p className="text-gray-700">
                  <strong>Address:</strong> Lorem Ipsum Street, 123, Dolor City, 45678
                </p>
                <p className="text-gray-700">
                  <strong>Phone:</strong> +1 (555) 123-4567
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
