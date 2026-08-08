import "./globals.css";

export const metadata = {
  title: "Oba Jafojo — Actor · Performer · Storyteller",
  description:
    "Official portfolio of Oba Jafojo, an actor and performer based in Georgia. Headshots, demo reel, resume, and contact.",
  openGraph: {
    title: "Oba Jafojo — Actor · Performer · Storyteller",
    description:
      "Official portfolio of Oba Jafojo, an actor and performer based in Georgia.",
    type: "website",
  },
};

export const viewport = {
  themeColor: "#fafafa",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Fonts via Google Fonts CDN — Playfair Display (headings) + Inter (body).
            The CSS variables they map to are defined in globals.css. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-paper text-ink font-sans antialiased">{children}</body>
    </html>
  );
}
