import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_KEY!, {
  // This library's types only reflect the latest API version
  apiVersion: "2020-08-27"
})