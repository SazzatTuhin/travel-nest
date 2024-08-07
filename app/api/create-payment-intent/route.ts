// import { currentUser } from "@clerk/nextjs";
// import { NextResponse } from "next/server";
// import Stripe from "stripe";
// import prisma from "@/lib/db";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
//   apiVersion: "2024-04-10",
// });

// export async function POST(req: Request) {
//   const user = await currentUser();

//   if (!user) {
//     return new NextResponse("Unauthorized", { status: 401 });
//   }

//   const body = await req.json();
//   const { booking, payment_intent_id } = body;

//   const bookingData = {
//     ...booking,
//     user_name: user.firstName,
//     user_email: user.emailAddresses[0].emailAddress,
//     userId: user.id,
//     currency: "usd",
//     payment_intent_id,
//   };

//   let foundBooking;

//   if (payment_intent_id) {
//     foundBooking = await prisma.booking.findUnique({
//       where: { payment_intent_id, userId: user.id },
//     });
//   }

//   if (foundBooking && payment_intent_id) {
//     // update
//   } else {
//     // create

//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: booking.total_price * 100,
//       currency: bookingData.currency,
//       automatic_payment_methods: { enabled: true },
//     });

//     bookingData.payment_intent_id = paymentIntent.id;

//     await prisma.booking.create({
//       data: bookingData,
//     });

//     return NextResponse.json({ paymentIntent });
//   }

//   return new NextResponse("Internal server error", { status: 500 });
// }

import prisma from "@/lib/db";
import { currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-04-10",
});

export async function POST(req: Request) {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { booking, payment_intent_id } = body;

    if (!booking || !booking.total_price) {
      return NextResponse.json(
        { error: "Bad Request: Missing required booking information" },
        { status: 400 }
      );
    }

    const bookingData = {
      ...booking,
      user_name: user.firstName,
      user_email: user.emailAddresses[0].emailAddress,
      userId: user.id,
      currency: "usd",
      payment_intent_id,
    };

    let foundBooking;

    if (payment_intent_id) {
      foundBooking = await prisma.booking.findUnique({
        where: { payment_intent_id, userId: user.id },
      });
    }

    if (foundBooking && payment_intent_id) {
      // update booking
      const current_intent = await stripe.paymentIntents.retrieve(
        payment_intent_id
      );

      if (current_intent) {
        const update_intent = await stripe.paymentIntents.update(
          payment_intent_id,
          { amount: booking.total_price * 100 }
        );

        const res = await prisma.booking.update({
          where: {
            payment_intent_id,
            userId: user.id,
          },
          data: bookingData,
        });

        if (!res) {
          return NextResponse.error();
        }

        return NextResponse.json({ paymentIntent: update_intent });
      }
    } else {
      // Create a new booking
      const paymentIntent = await stripe.paymentIntents.create({
        amount: booking.total_price * 100, // Stripe expects the amount in cents
        currency: bookingData.currency,
        automatic_payment_methods: { enabled: true },
      });

      bookingData.payment_intent_id = paymentIntent.id;

      await prisma.booking.create({
        data: bookingData,
      });

      return NextResponse.json({ paymentIntent });
    }
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
