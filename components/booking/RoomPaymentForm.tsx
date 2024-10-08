// "use client";

// import useBookRoom from "@/hooks/useBookRoom";
// import {
//   AddressElement,
//   PaymentElement,
//   useElements,
//   useStripe,
// } from "@stripe/react-stripe-js";
// import axios from "axios";
// import moment from "moment";
// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
// import { Button } from "../ui/button";
// import { Separator } from "../ui/separator";
// import { useToast } from "../ui/use-toast";
// import { Booking } from "@prisma/client";
// import { endOfDay, isWithinInterval, startOfDay } from "date-fns";

// interface Props {
//   clientSecret: string;
//   handlePaymentSuccess: (value: boolean) => void;
// }

// type DateRangesType = {
//   startDate: Date;
//   endDate: Date;
// };

// function hasOverlap(
//   startDate: Date,
//   endDate: Date,
//   dateRanges: DateRangesType[]
// ) {
//   const targetInterval = {
//     start: startOfDay(new Date(startDate)),
//     end: endOfDay(new Date(endDate)),
//   };

//   for (const range of dateRanges) {
//     const rangeStart = startOfDay(new Date(range.startDate));
//     const rangeEnd = endOfDay(new Date(range.endDate));

//     if (
//       isWithinInterval(targetInterval.start, {
//         start: rangeStart,
//         end: rangeEnd,
//       }) ||
//       isWithinInterval(targetInterval.end, {
//         start: rangeStart,
//         end: rangeEnd,
//       }) ||
//       (targetInterval.start < rangeStart && targetInterval.end > rangeEnd)
//     ) {
//       return true;
//     }
//   }

//   return false;
// }

// const RoomPaymentForm = ({ clientSecret, handlePaymentSuccess }: Props) => {
//   const { bookedRoomData, resetBookRoom } = useBookRoom();
//   const stripe = useStripe();
//   const elements = useElements();
//   const [isLoading, setIsLoading] = useState(false);
//   const { toast } = useToast();

//   const router = useRouter();

//   useEffect(() => {
//     if (!stripe) {
//       return;
//     }

//     if (!clientSecret) {
//       return;
//     }

//     handlePaymentSuccess(false);
//     setIsLoading(false);
//   }, [stripe, clientSecret, handlePaymentSuccess]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);

//     if (!stripe || !elements || !bookedRoomData) {
//       return;
//     }

//     try {
//       // date overlaps
//       const bookings = await axios.get(
//         `/api/booking/${bookedRoomData.room.id}`
//       );

//       const roomBookingDates = bookings.data.map((booking: Booking) => {
//         return {
//           startDate: booking.start_date,
//           endDate: booking.end_date,
//         };
//       });

//       const overlapFound = hasOverlap(
//         bookedRoomData.startDate,
//         bookedRoomData.endDate,
//         roomBookingDates
//       );

//       if (overlapFound) {
//         setIsLoading(false);
//         return toast({
//           variant: "destructive",
//           description:
//             "Some of the days are trying to book already been reserved.",
//         });
//       }

//       stripe
//         .confirmPayment({ elements, redirect: "if_required" })
//         .then((result) => {
//           if (!result.error) {
//             axios
//               .patch(`/api/booking/${result.paymentIntent.id}`)
//               .then((res) => {
//                 toast({
//                   description: "Room Reservation is done!",
//                 });
//                 router.refresh();
//                 resetBookRoom();
//                 handlePaymentSuccess(true);
//                 setIsLoading(false);
//               })
//               .catch((error) => {
//                 console.log(error);
//                 toast({
//                   variant: "destructive",
//                   description: "Room Reservation is failed!",
//                 });
//                 setIsLoading(false);
//               });
//           } else {
//             setIsLoading(false);
//           }
//         });
//     } catch (error) {
//       console.log(error);
//       setIsLoading(false);
//     }
//   };

//   const startDate = moment(bookedRoomData?.startDate).format("DD MM YYYY");
//   const endDate = moment(bookedRoomData?.endDate).format("DD MM YYYY");

//   return (
//     <form onSubmit={handleSubmit} id="payment-form">
//       <h2 className="font-semibold mb-2 text-lg">Billing Address</h2>
//       <AddressElement
//         options={{
//           mode: "billing",
//         }}
//       />
//       <h2 className="font-semibold mt-5 mb-2 text-lg">Payment Information</h2>
//       <PaymentElement id="payment-element" options={{ layout: "tabs" }} />
//       <div className="flex flex-col gap-2">
//         <Separator />
//         <div className="flex flex-col gap-2">
//           <h2 className="font-semibold mb-2 text-lg">Your Booking Summary</h2>
//           <p>You will check-in on {startDate} at 12PM</p>
//           <p>You will check-out on {endDate} at 12PM</p>
//           {bookedRoomData?.breakfastIncluded && (
//             <p>You will be served breakfast each day at 8AM</p>
//           )}
//         </div>
//         <Separator />
//         <div className="font-bold text-lg">
//           {bookedRoomData?.breakfastIncluded && (
//             <>
//               <p className="mb-2">
//                 Breakfast Price: ${bookedRoomData?.room?.breakfast_price}
//               </p>
//               <p>Total Price: ${bookedRoomData?.totalPrice}</p>
//             </>
//           )}
//         </div>
//       </div>
//       <Button disabled={isLoading} className="mt-5">
//         {isLoading ? "Processing Payment..." : "Pay Now"}
//       </Button>
//     </form>
//   );
// };

// export default RoomPaymentForm;

"use client";

import useBookRoom from "@/hooks/useBookRoom";
import {
  AddressElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { useToast } from "../ui/use-toast";
import { Booking } from "@prisma/client";
import { endOfDay, isWithinInterval, startOfDay } from "date-fns";

interface Props {
  clientSecret: string;
  handlePaymentSuccess: (value: boolean) => void;
}

type DateRangesType = {
  startDate: Date;
  endDate: Date;
};

function hasOverlap(
  startDate: Date,
  endDate: Date,
  dateRanges: DateRangesType[]
) {
  const targetInterval = {
    start: startOfDay(new Date(startDate)),
    end: endOfDay(new Date(endDate)),
  };

  for (const range of dateRanges) {
    const rangeStart = startOfDay(new Date(range.startDate));
    const rangeEnd = endOfDay(new Date(range.endDate));

    if (
      isWithinInterval(targetInterval.start, {
        start: rangeStart,
        end: rangeEnd,
      }) ||
      isWithinInterval(targetInterval.end, {
        start: rangeStart,
        end: rangeEnd,
      }) ||
      (targetInterval.start < rangeStart && targetInterval.end > rangeEnd)
    ) {
      return true;
    }
  }

  return false;
}

const RoomPaymentForm = ({ clientSecret, handlePaymentSuccess }: Props) => {
  const { bookedRoomData, resetBookRoom } = useBookRoom();
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const router = useRouter();

  useEffect(() => {
    if (!stripe) {
      return;
    }

    if (!clientSecret) {
      return;
    }

    handlePaymentSuccess(false);
    setIsLoading(false);
  }, [stripe, clientSecret, handlePaymentSuccess]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!stripe || !elements || !bookedRoomData) {
      return;
    }

    try {
      // date overlaps
      const bookings = await axios.get(
        `/api/booking/${bookedRoomData.room.id}`
      );

      const roomBookingDates = bookings.data.map((booking: Booking) => {
        return {
          startDate: booking.start_date,
          endDate: booking.end_date,
        };
      });

      const overlapFound = hasOverlap(
        bookedRoomData.startDate,
        bookedRoomData.endDate,
        roomBookingDates
      );

      if (overlapFound) {
        setIsLoading(false);
        return toast({
          variant: "destructive",
          description:
            "Some of the days are trying to book already been reserved.",
        });
      }

      stripe
        .confirmPayment({ elements, redirect: "if_required" })
        .then((result) => {
          if (!result.error) {
            axios
              .patch(`/api/booking/${result.paymentIntent.id}`)
              .then((res) => {
                toast({
                  description: "Room Reservation is done!",
                });
                router.refresh();
                resetBookRoom();
                handlePaymentSuccess(true);
                setIsLoading(false);
              })
              .catch((error) => {
                console.log(error);
                toast({
                  variant: "destructive",
                  description: "Room Reservation is failed!",
                });
                setIsLoading(false);
              });
          } else {
            setIsLoading(false);
          }
        });
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const startDate = moment(bookedRoomData?.startDate).format("DD MM YYYY");
  const endDate = moment(bookedRoomData?.endDate).format("DD MM YYYY");

  return (
    <form onSubmit={handleSubmit} id="payment-form">
      <h2 className="font-semibold mb-2 text-lg">Billing Address</h2>
      <AddressElement
        options={{
          mode: "billing",
        }}
      />
      <h2 className="font-semibold mt-5 mb-2 text-lg">Payment Information</h2>
      <PaymentElement id="payment-element" options={{ layout: "tabs" }} />
      <div className="flex flex-col gap-2">
        <Separator />
        <div className="flex flex-col gap-2">
          <h2 className="font-semibold mb-2 text-lg">Your Booking Summary</h2>
          <p>You will check-in on {startDate} at 12PM</p>
          <p>You will check-out on {endDate} at 12PM</p>
          {bookedRoomData?.breakfastIncluded && (
            <p>You will be served breakfast each day at 8AM</p>
          )}
        </div>
        <Separator />
        <div className="font-bold text-lg">
          {bookedRoomData?.breakfastIncluded && (
            <>
              <p className="mb-2">
                Breakfast Price: ${bookedRoomData?.room?.breakfast_price}
              </p>
              <p>Total Price: ${bookedRoomData?.totalPrice}</p>
            </>
          )}
        </div>
      </div>
      <Button disabled={isLoading} className="mt-5">
        {isLoading ? "Processing Payment..." : "Pay Now"}
      </Button>
    </form>
  );
};

export default RoomPaymentForm;
