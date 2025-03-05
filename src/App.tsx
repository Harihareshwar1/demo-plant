import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'
import { auth, provider } from './firebaseConfig'
import { signInWithPopup } from 'firebase/auth'
import Home from './pages/Home'
import Predict from './pages/Predict'
import {History} from './pages/History'
import './index.css'

function App() {
  const [user, setUser] = useState<any>(null);

  const signInWithGoogle = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        setUser(result.user);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-white">
        <nav className="bg-gray-800 p-4 sticky top-0 z-50">
          <div className="container mx-auto">
            <div className="flex justify-between items-center">
              <div className="font-bold text-xl">Plant Disease Identifier</div>
              {user && (
                <ul className="flex items-center space-x-6">
                  <li><Link to="/" className="hover:text-blue-400">Home</Link></li>
                  <li><Link to="/predict" className="hover:text-blue-400">Predict</Link></li>
                  <li><Link to="/history" className="hover:text-blue-400">History</Link></li>
                </ul>
              )}
              {user && (
                <div className="flex items-center space-x-3 bg-gray-700 p-2 rounded-lg">
                  <img 
                    src={user.photoURL} 
                    alt="Profile" 
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="text-sm hidden md:block">{user.displayName}</span>
                  <button 
                    onClick={() => auth.signOut().then(() => setUser(null))} 
                    className="text-sm text-red-400 hover:text-red-300"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </nav>
        <div className="container mx-auto px-4 py-8">
          {!user ? (
            <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-8">
              <div className="text-center space-y-4 max-w-2xl">
                <h1 className="text-4xl md:text-5xl font-bold mb-8">Welcome to Plant Disease Identifier</h1>
                <p className="text-xl text-gray-300 mb-8">
                  Identify plant diseases instantly using our advanced AI technology. 
                  Sign in to start protecting your plants!
                </p>
                <button 
                  onClick={signInWithGoogle} 
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transform transition hover:scale-105"
                >
                  Sign in with Google
                </button>
              </div>
            </div>
          ) : (
            <Routes>
              <Route path="/" element={<Home user={user} />} />
              <Route path="/predict" element={<Predict />} />
              <Route path="/history" element={<History />} />
            </Routes>
          )}
        </div>
      </div>
    </Router>
  )
}

export default App
