import './App.css'
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </>
  );
}

export default App
