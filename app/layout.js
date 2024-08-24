'use client';
import { AuthProvider } from './context/authContext'; // Ensure this path is correct
import { CssBaseline } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Navbar from './navbar';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <CssBaseline />
          <Navbar />
          <main>
            {children} {/* This renders the content of each page */}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
