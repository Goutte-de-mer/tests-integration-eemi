import "@/style/globals.css";

export const metadata = {
  title: "Login tests",
  description: "Module tests d'integration",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
