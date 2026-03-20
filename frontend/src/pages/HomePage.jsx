import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <div>
      <section className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <h1 className="text-5xl font-bold">Welcome to EcomStore</h1>
        <p className="mt-4 max-w-lg text-xl text-muted-foreground">
          Discover amazing products at great prices. Shop with confidence.
        </p>
        <div className="mt-8 flex gap-4">
          <Link to="/products">
            <Button size="lg">Shop Now</Button>
          </Link>
          <Link to="/register">
            <Button size="lg" variant="outline">Create Account</Button>
          </Link>
        </div>
      </section>

      <section className="mt-16 grid gap-8 md:grid-cols-3">
        <div className="text-center">
          <h3 className="text-xl font-semibold">Free Shipping</h3>
          <p className="mt-2 text-muted-foreground">On orders over $50</p>
        </div>
        <div className="text-center">
          <h3 className="text-xl font-semibold">Secure Payment</h3>
          <p className="mt-2 text-muted-foreground">100% secure payment</p>
        </div>
        <div className="text-center">
          <h3 className="text-xl font-semibold">24/7 Support</h3>
          <p className="mt-2 text-muted-foreground">Dedicated support</p>
        </div>
      </section>
    </div>
  );
}
