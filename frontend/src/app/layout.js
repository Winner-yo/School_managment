import './globals.css'; 
import Navigation from '../components/Navigation';

export const metadata = {
  title: 'School Management System',
  description: 'Simple school app',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navigation />
        <main>{children}</main>
      </body>
    </html>
  );
}