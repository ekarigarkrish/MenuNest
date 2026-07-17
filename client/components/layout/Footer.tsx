import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          
          {/* Brand Col */}
          <div className="col-span-2 lg:col-span-2">
            <Link href="#" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cayenne-red-500 to-orange-500 flex items-center justify-center">
                <span className="text-white font-bold text-xl leading-none">M</span>
              </div>
              <span className="font-bold text-xl tracking-tight text-carbon-black-900">
                MenuNest
              </span>
            </Link>
            <p className="text-carbon-black-600 mb-6 max-w-xs">
              Transforming the dining experience with smart QR menus and automated restaurant operations.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-400 hover:text-cayenne-red-500 transition-colors">
                <span className="sr-only">Facebook</span>
                {/* <Facebook className="w-5 h-5" /> */}
              </Link>
              <Link href="#" className="text-gray-400 hover:text-cayenne-red-500 transition-colors">
                <span className="sr-only">Twitter</span>
                {/* <Twitter className="w-5 h-5" /> */}
              </Link>
              <Link href="#" className="text-gray-400 hover:text-cayenne-red-500 transition-colors">
                <span className="sr-only">Instagram</span>
                {/* <Instagram className="w-5 h-5" /> */}
              </Link>
              <Link href="#" className="text-gray-400 hover:text-cayenne-red-500 transition-colors">
                <span className="sr-only">LinkedIn</span>
                {/* <Linkedin className="w-5 h-5" /> */}
              </Link>
            </div>
          </div>

          {/* Links Cols */}
          <div>
            <h4 className="font-semibold text-carbon-black-900 mb-4">Product</h4>
            <ul className="space-y-3">
              <li><Link href="#features" className="text-carbon-black-600 hover:text-cayenne-red-600 text-sm">Features</Link></li>
              <li><Link href="#pricing" className="text-carbon-black-600 hover:text-cayenne-red-600 text-sm">Pricing</Link></li>
              <li><Link href="#" className="text-carbon-black-600 hover:text-cayenne-red-600 text-sm">Integrations</Link></li>
              <li><Link href="#" className="text-carbon-black-600 hover:text-cayenne-red-600 text-sm">Changelog</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-carbon-black-900 mb-4">Company</h4>
            <ul className="space-y-3">
              <li><Link href="#" className="text-carbon-black-600 hover:text-cayenne-red-600 text-sm">About Us</Link></li>
              <li><Link href="#" className="text-carbon-black-600 hover:text-cayenne-red-600 text-sm">Careers</Link></li>
              <li><Link href="#" className="text-carbon-black-600 hover:text-cayenne-red-600 text-sm">Blog</Link></li>
              <li><Link href="#" className="text-carbon-black-600 hover:text-cayenne-red-600 text-sm">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-carbon-black-900 mb-4">Legal</h4>
            <ul className="space-y-3">
              <li><Link href="#" className="text-carbon-black-600 hover:text-cayenne-red-600 text-sm">Privacy Policy</Link></li>
              <li><Link href="#" className="text-carbon-black-600 hover:text-cayenne-red-600 text-sm">Terms of Service</Link></li>
              <li><Link href="#" className="text-carbon-black-600 hover:text-cayenne-red-600 text-sm">Cookie Policy</Link></li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm text-center md:text-left mb-4 md:mb-0">
            &copy; {currentYear} MenuNest. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm text-gray-500">
            <span>Made with ❤️ for restaurants</span>
          </div>
        </div>
      </div>
    </footer>
  );
}