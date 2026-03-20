import { Helmet } from 'react-helmet-async';

export default function Blog() {
  return (
    <div className="min-h-screen py-20">
      <Helmet>
        <title>Blog - Mobizilla</title>
        <meta name="description" content="Latest news, tips, and articles about mobile device care." />
      </Helmet>

      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Blog</h1>
          <p className="text-xl text-gray-600">Latest news and repair tips</p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <h3 className="text-xl font-semibold text-green-800 mb-2">Coming Soon</h3>
            <p className="text-green-700">Stay tuned for helpful articles and repair tips.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
