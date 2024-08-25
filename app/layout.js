'use client';
import { AuthProvider } from './context/authContext'; 
import { CssBaseline } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Navbar from './navbar';
import Footer from './footer/page';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <AuthProvider>
          <CssBaseline />
          <Navbar />
          <main style={{ flex: 1 }}>
            {children} 
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
