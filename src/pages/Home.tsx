
import { Link } from 'react-router-dom';

const Home = ({ user }: { user: any }) => {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Welcome, {user.displayName}!
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          Your personal plant health assistant is ready to help.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">How It Works</h2>
          <ul className="space-y-4 text-gray-300">
            <li>1. Upload a photo of your plant</li>
            <li>2. Our AI analyzes the image</li>
            <li>3. Get instant disease detection results</li>
            <li>4. View detailed history of all your scans</li>
          </ul>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Features</h2>
          <ul className="space-y-4 text-gray-300">
            <li>✓ Instant disease detection</li>
            <li>✓ Secure cloud storage</li>
            <li>✓ Historical analysis</li>
            <li>✓ Mobile-friendly interface</li>
          </ul>
        </div>
      </div>

      <div className="text-center">
        <Link 
          to="/predict" 
          className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transform transition hover:scale-105"
        >
          Start Scanning
        </Link>
      </div>
    </div>
  );
};

export default Home;
