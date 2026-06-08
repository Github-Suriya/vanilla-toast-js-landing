import { Navbar, Footer } from './components/Layout';
import LandingPage from './components/LandingPage';
import Toaster from './components/Toaster';

export default function App() {
  return (
    <div className="relative min-h-screen">
      <Navbar />
      <LandingPage />
      <Footer />
      <Toaster />
    </div>
  );
}
