import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Projects from './pages/Projects';
import Contact from './pages/Contact';
import MainDesktopExperience from './Components/PostLogin/MainDesktopView';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainDesktopExperience />} />
        <Route path="/thankyou" element={<Contact />} />
      </Routes>
    </Router>
  );
}
