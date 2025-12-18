import "@/styles/globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import NeuralNetworkBackground from "@/components/NeuralNetworkBackground";

export const metadata = {
  title: "AI CV Maker", 
  description: "Generate professional CVs with AI",
  icons: {
    icon: '/icon.svg', // This points to the file we just made
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