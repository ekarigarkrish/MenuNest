export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-100 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center items-center">
        <p className="text-gray-500 text-sm text-center md:text-left mb-4 md:mb-0">
          &copy; {currentYear} MenuNest. All rights reserved.
        </p>
      </div>
    </footer>
  );
}