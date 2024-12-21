// components/Footer.tsx
export default function Footer() {
    return (
      <footer className="py-6 text-sm text-gray-700 bg-white shadow-inner text-center">
        &copy; {new Date().getFullYear()} Stress Analyzer. All Rights Reserved.
      </footer>
    );
  }