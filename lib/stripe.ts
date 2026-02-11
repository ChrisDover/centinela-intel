import Stripe from "stripe";

let _stripe: Stripe | null = null;

export default function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  }
  return _stripe;
}
