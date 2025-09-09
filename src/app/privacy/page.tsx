import { getTranslations } from 'next-intl/server';

export default async function PrivacyPolicyPage() {
  const t = await getTranslations('privacy');

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-3xl text-accent mb-8 highlight-secondary">
        Privacy Policy
      </h1>

      <div className="space-y-8">
        <section className="space-y-4">
          <p className="text-gray-600 text-sm mb-6">
            <strong>Last updated:</strong> Lorem ipsum dolor sit amet, 2024
          </p>
          
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-accent mb-4">
            1. Information We Collect
          </h2>
          <div className="prose prose-gray max-w-none space-y-4">
            <h3 className="text-lg font-medium text-accent">1.1 Personal Information</h3>
            <p className="text-gray-700 leading-relaxed">
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
            </p>
            
            <h3 className="text-lg font-medium text-accent">1.2 Usage Data</h3>
            <p className="text-gray-700 leading-relaxed">
              Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
            </p>
            
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit</li>
              <li>Sed do eiusmod tempor incididunt ut labore et dolore</li>
              <li>Ut enim ad minim veniam, quis nostrud exercitation</li>
              <li>Duis aute irure dolor in reprehenderit in voluptate</li>
            </ul>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-accent mb-4">
            2. How We Use Your Information
          </h2>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 leading-relaxed mb-4">
              At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.
            </p>
            
            <div className="bg-gray-50 border-l-4 border-primary p-4 my-4">
              <p className="text-gray-700">
                <strong>Important:</strong> Similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.
              </p>
            </div>
            
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Lorem ipsum dolor sit amet, consectetur adipiscing</li>
              <li>Sed do eiusmod tempor incididunt ut labore</li>
              <li>Ut enim ad minim veniam, quis nostrud</li>
              <li>Duis aute irure dolor in reprehenderit</li>
            </ul>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-accent mb-4">
            3. Data Sharing and Disclosure
          </h2>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 leading-relaxed mb-4">
              Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus.
            </p>
            
            <h3 className="text-lg font-medium text-accent">3.1 Third-Party Services</h3>
            <p className="text-gray-700 leading-relaxed">
              Omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint.
            </p>
            
            <h3 className="text-lg font-medium text-accent">3.2 Legal Requirements</h3>
            <p className="text-gray-700 leading-relaxed">
              Et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-accent mb-4">
            4. Data Security
          </h2>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 leading-relaxed mb-4">
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg border border-secondary/20 p-4 shadow-sm">
                <h4 className="font-semibold text-accent mb-2">Encryption</h4>
                <p className="text-gray-700 text-sm">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.
                </p>
              </div>
              <div className="bg-white rounded-lg border border-secondary/20 p-4 shadow-sm">
                <h4 className="font-semibold text-accent mb-2">Access Control</h4>
                <p className="text-gray-700 text-sm">
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-accent mb-4">
            5. Your Rights
          </h2>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 leading-relaxed mb-4">
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt.
            </p>
            
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li><strong>Access:</strong> Lorem ipsum dolor sit amet, consectetur adipiscing</li>
              <li><strong>Rectification:</strong> Sed do eiusmod tempor incididunt ut labore</li>
              <li><strong>Erasure:</strong> Ut enim ad minim veniam, quis nostrud exercitation</li>
              <li><strong>Portability:</strong> Duis aute irure dolor in reprehenderit</li>
              <li><strong>Objection:</strong> Excepteur sint occaecat cupidatat non proident</li>
            </ul>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-accent mb-4">
            6. Cookies and Tracking
          </h2>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 leading-relaxed mb-4">
              Mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.
            </p>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300 text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-4 py-2 text-left font-medium text-accent">Cookie Type</th>
                    <th className="border border-gray-300 px-4 py-2 text-left font-medium text-accent">Purpose</th>
                    <th className="border border-gray-300 px-4 py-2 text-left font-medium text-accent">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">Essential</td>
                    <td className="border border-gray-300 px-4 py-2">Lorem ipsum dolor</td>
                    <td className="border border-gray-300 px-4 py-2">Session</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">Analytics</td>
                    <td className="border border-gray-300 px-4 py-2">Consectetur adipiscing</td>
                    <td className="border border-gray-300 px-4 py-2">30 days</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">Marketing</td>
                    <td className="border border-gray-300 px-4 py-2">Sed do eiusmod</td>
                    <td className="border border-gray-300 px-4 py-2">90 days</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-accent mb-4">
            7. Updates to This Policy
          </h2>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 leading-relaxed">
              Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-accent mb-4">
            8. Contact Us
          </h2>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 leading-relaxed mb-4">
              Sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt, neque porro quisquam est, qui dolorem ipsum quia dolor sit amet.
            </p>
            
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="space-y-2">
                <p className="text-gray-700"><strong>Email:</strong> privacy@mejorprecio.com</p>
                <p className="text-gray-700"><strong>Address:</strong> Lorem Ipsum Street, 123, Dolor City, 45678</p>
                <p className="text-gray-700"><strong>Phone:</strong> +1 (555) 123-4567</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}