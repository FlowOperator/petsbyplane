import { ScrollViewStyleReset } from 'expo-router/html';

/**
 * Custom HTML template for the web export.
 * Adds Open Graph meta tags, structured data, and performance hints.
 */
export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />

        {/* Primary meta */}
        <title>Pets by Plane — Fly Your Pet Anywhere in the World</title>
        <meta name="description" content="Expert-led pet relocation with a dedicated consultant guiding every step. Visible, trackable, stress-free. 25+ years, 5,000+ pets flown, 150+ destinations." />
        <meta name="theme-color" content="#E8623D" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Pets by Plane — Fly Your Pet Anywhere" />
        <meta property="og:description" content="Expert-led pet relocation. Dedicated consultant, live tracking, stress-free. Get a free quote today." />
        <meta property="og:site_name" content="Pets by Plane" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Pets by Plane" />
        <meta name="twitter:description" content="Fly your pet anywhere in the world. Expert-led relocation with live tracking." />

        {/* Preconnect to fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />

        <ScrollViewStyleReset />

        <style dangerouslySetInnerHTML={{ __html: `
          html, body { height: 100%; background-color: #EAE6DC; }
          body { overflow: hidden; }
          #root { display: flex; height: 100%; flex: 1; }
        `}} />
      </head>
      <body>{children}</body>
    </html>
  );
}
