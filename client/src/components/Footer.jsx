import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-stone-line mt-12 sm:mt-16 md:mt-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-6 md:px-8 py-8 sm:py-10 md:py-12 grid gap-6 sm:gap-8 md:gap-10 grid-cols-2 md:grid-cols-3 font-body text-sm text-ink/80">
        <div className="col-span-2 md:col-span-1">
          <div className="font-display text-base sm:text-lg mb-2">
            Këpucë e Artë
          </div>
          <p className="text-stone leading-relaxed text-xs sm:text-sm">
            Shoes built to be worn, not admired from a shelf. Rruga Myslym Shyri
            49, Tirana.
          </p>
        </div>
        <div>
          <div className="stamp text-ink mb-2 sm:mb-3">Visit</div>
          <ul className="space-y-1 text-stone text-xs sm:text-sm">
            <li>Mon–Sat, 10:00–19:00</li>
            <li>+355 69 123 4567</li>
            <li className="break-all">hello@kepuceearte.al</li>
          </ul>
        </div>
        <div>
          <div className="stamp text-ink mb-2 sm:mb-3">Shop</div>
          <ul className="space-y-1 text-stone text-xs sm:text-sm">
            <li>
              <Link to="/products" className="hover:text-oxblood">
                All products
              </Link>
            </li>
            <li>
              <Link to="/track-order" className="hover:text-oxblood">
                Track order
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-oxblood">
                Contact
              </Link>
            </li>
            <li>
              <Link to="/admin/login" className="hover:text-oxblood">
                Admin
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="stitch">
        <div className="mx-auto max-w-6xl px-5 sm:px-6 md:px-8 py-3 sm:py-4 text-[10px] sm:text-[11px] font-mono uppercase tracking-stamp text-stone text-center">
          Pay on delivery, Tirana &amp; nationwide
        </div>
      </div>
    </footer>
  );
}
