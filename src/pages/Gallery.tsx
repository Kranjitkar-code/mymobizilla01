import { Helmet } from 'react-helmet-async';

export default function Gallery() {
  return (
    <div className="min-h-screen py-20">
      <Helmet>
        <title>Gallery - Mobizilla</title>
        <meta name="description" content="View our repair work and facilities at Mobizilla." />
      </Helmet>

      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Gallery</h1>
          <p className="text-xl text-gray-600">Our repair work and facilities</p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">ComSoon</h3>
            <p className="text-gray-700">Gallery showcasing our repair work and facilities will be available soon.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
