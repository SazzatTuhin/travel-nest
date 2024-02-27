"use client";

import { Hotel, Room } from "@prisma/client";
import * as z from "zod";

interface AddHotelFormProps {
  hotel: HotelWithRooms | null;
}

export type HotelWithRooms = Hotel & {
  rooms: Room[];
};

const formSchema = z.object({
  title: z.string().min(3, { message: "Title must be atlist 3 chars long" }),
  description: z
    .string()
    .min(9, { message: "Description must be atlist 3 chars long" }),
  image: z.string().min(1, { message: "image is required" }),
  country: z.string().min(1, { message: "country is required" }),
  state: z.string().optional(),
  city: z.string().optional(),
  locationDescription: z
    .string()
    .min(9, { message: "Description must be atlist 3 chars long" }),
  gym: z.boolean().optional(),
  spa: z.boolean().optional(),
  bar: z.boolean().optional(),
  laundry: z.boolean().optional(),
  restaurant: z.boolean().optional(),
  swiming_poll: z.boolean().optional(),
  cineplex: z.boolean().optional(),
  free_wifi: z.boolean().optional(),
  sports_zone: z.boolean().optional(),
  medical_service: z.boolean().optional(),
});

const AddHotelForm = ({ hotel }: AddHotelFormProps) => {
  return <div>AddHotelForm</div>;
};

export default AddHotelForm;
