// app/layout.js
'use client'
import { AuthProvider } from './context/authContext';
import { CssBaseline } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Navbar from './navbar';
import Dashboard from './dashboard/page';


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
         
            <CssBaseline />
            <Navbar/>
            <main>
              {children} {/* This renders the content of each page */}
            </main>


        </AuthProvider>
      </body>
    </html>
  );
}
