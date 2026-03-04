import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import FormPage from './pages/FormPage';
import DataPage from './pages/DataPage';

function Navbar() {
  const location = useLocation();

  return (
    <div className="navbar bg-base-100 shadow-sm sticky top-0 z-50">
      <div className="flex-1">
        <a className="btn btn-ghost text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Impetus Tickets
        </a>
      </div>
      <div className="flex-none hidden sm:flex space-x-2 mr-2">
        <Link
          to="/"
          className={`btn btn-sm ${location.pathname === '/' ? 'btn-primary' : 'btn-ghost'}`}
        >
          Collect Data
        </Link>
        <Link
          to="/data"
          className={`btn btn-sm ${location.pathname === '/data' ? 'btn-secondary' : 'btn-ghost'}`}
        >
          Dashboard
        </Link>
      </div>
      {/* Mobile menu dropdown */}
      <div className="flex-none sm:hidden dropdown dropdown-end">
        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" /></svg>
        </div>
        <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
          <li><Link to="/" className={location.pathname === '/' ? 'active' : ''}>Collect Data</Link></li>
          <li><Link to="/data" className={location.pathname === '/data' ? 'active' : ''}>Dashboard</Link></li>
        </ul>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-base-200" data-theme="forest">
        <Navbar />
        <main className="container mx-auto p-4 md:p-8">
          <Routes>
            <Route path="/" element={<FormPage />} />
            <Route path="/data" element={<DataPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
