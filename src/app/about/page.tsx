import { getTranslations } from 'next-intl/server';

export default async function AboutPage() {
  const t = await getTranslations('about');
  console.debug('🚀 [AboutPage] Initializing with t:', t);

  return (
    <div className="mx-auto max-w-4xl p-6 my-6">
      <h1 className="text-3xl text-accent mb-8 highlight-primary">About Save On Baby</h1>

      <div className="space-y-8">
        <section className="space-y-4">
          <h2 className="text-xl text-accent mb-4 highlight-secondary">Our Mission</h2>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 leading-relaxed mb-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
              exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
              officia deserunt mollit anim id est laborum.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl text-accent mb-4 highlight-secondary">What We Do</h2>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 leading-relaxed mb-4">
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque
              laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi
              architecto beatae vitae dicta sunt explicabo.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia
              consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit</li>
              <li>Sed do eiusmod tempor incididunt ut labore et dolore</li>
              <li>Ut enim ad minim veniam, quis nostrud exercitation</li>
              <li>Duis aute irure dolor in reprehenderit in voluptate</li>
            </ul>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl text-accent mb-4 highlight-secondary">Our Team</h2>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 leading-relaxed mb-4">
              At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium
              voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint
              occaecati cupiditate non provident.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum
              fuga. Et harum quidem rerum facilis est et expedita distinctio.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl text-accent mb-4 highlight-secondary">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="font-semibold text-accent">Quality</h3>
              <p className="text-gray-700 text-sm">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                incididunt ut labore.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-accent">Innovation</h3>
              <p className="text-gray-700 text-sm">
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
                ex ea commodo.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-accent">Trust</h3>
              <p className="text-gray-700 text-sm">
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
                fugiat nulla.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-accent">Excellence</h3>
              <p className="text-gray-700 text-sm">
                Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
                mollit anim.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
