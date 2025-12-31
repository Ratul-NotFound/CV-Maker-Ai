import "@/styles/globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import NeuralNetworkBackground from "@/components/NeuralNetworkBackground";

export const metadata = {
  title: "CV Maker AI", 
  description: "Generate professional CVs with AI",
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' }
    ],
    apple: '/favicon.svg'
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased bg-slate-950">
        <AuthProvider>
          
          <div className="live-bg fixed inset-0 z-0 pointer-events-none">
            <div className="orb orb-1" />
            <div className="orb orb-2" />
            <div className="orb orb-3" />
          </div>
          
          <NeuralNetworkBackground />

          <Navbar />
          
          <main className="min-h-screen relative z-10 pt-20">
            {children}
          </main>
          
        </AuthProvider>
      </body>
    </html>
  );
}