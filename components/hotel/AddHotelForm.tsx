"use client";

import { Hotel, Room } from "@prisma/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";
import { useState } from "react";
import { UploadButton } from "../ui/uploadthing";
import { useToast } from "../ui/use-toast";
import Image from "next/image";
import { Button } from "../ui/button";
import { Ghost, Loader2, XCircle, icons } from "lucide-react";
import axios from "axios";

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
    .min(9, { message: "Description must be atlist 9 chars long" }),
  image: z.string().min(1, { message: "Image is required" }),
  country: z.string().min(1, { message: "country is required" }),
  state: z.string().optional(),
  city: z.string().optional(),
  locationDescription: z
    .string()
    .min(9, { message: "Description must be atlist 9 chars long" }),
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
  const [image, setImage] = useState<string | undefined>(hotel?.image);
  const [shouldImageDelete, setShouldImageDelete] = useState<boolean>(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      image: "",
      country: "",
      state: "",
      city: "",
      locationDescription: "",
      gym: false,
      spa: false,
      bar: false,
      laundry: false,
      restaurant: false,
      swiming_poll: false,
      cineplex: false,
      free_wifi: false,
      sports_zone: false,
      medical_service: false,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  const handleImageDelete = (image: string) => {
    setShouldImageDelete(true);

    const imageKey = image.substring(image.lastIndexOf("/") + 1);

    axios
      .post("/api/uploadthing/delete", { imageKey })
      .then((res) => {
        if (res.data.success) {
          setImage("");
          toast({
            title: "Image deleted",
            description: "Your hotel image has been successfully deleted.",
          });
        }
      })
      .catch(() => {
        toast({
          variant: "destructive",
          title: "Image delete failed",
        });
      })
      .finally(() => {
        setShouldImageDelete(false);
      });
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <h2 className="text-xl font-semibold">
            {hotel ? "Update your hotel" : "Add a hotel"}
          </h2>
          <div className="flex flex-col md:flex-row gap-5">
            {/* left div  */}
            <div className="flex-1 flex flex-col gap-5 ">
              {/* Title  */}

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hotel title</FormLabel>
                    <FormDescription>Enter your hotel title</FormDescription>
                    <FormControl>
                      <Input placeholder="Seawing hotel" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description  */}

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hotel description</FormLabel>
                    <FormDescription>
                      Enter your hotel description
                    </FormDescription>
                    <FormControl>
                      <Textarea placeholder="Describe your hotel" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Facilities  */}

              <div>
                <FormLabel>Choose facilities</FormLabel>
                <FormDescription>
                  Choose popular facilities in your hotel
                </FormDescription>

                <div className="grid grid-cols-2 gap-5 mt-2">
                  <FormField
                    control={form.control}
                    name="gym"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-end gap-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>Gym</FormLabel>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="spa"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-end gap-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>Spa</FormLabel>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="bar"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-end gap-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>Bar</FormLabel>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="laundry"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-end gap-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>Laundry</FormLabel>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="restaurant"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-end gap-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>Restaurant</FormLabel>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="swiming_poll"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-end gap-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>Swiming Pool</FormLabel>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="cineplex"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-end gap-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>Cineplex</FormLabel>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="free_wifi"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-end gap-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>Free Wifi</FormLabel>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="sports_zone"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-end gap-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>Sports Zone</FormLabel>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="medical_service"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-end gap-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>Medical Service</FormLabel>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Upload an image</FormLabel>
                    <FormDescription>Upload a hotel image</FormDescription>
                    <FormControl>
                      {image ? (
                        <div className="relative max-w-[400px] min-w-[400px]  max-h-[400px] min-h-[400px] mt-4">
                          <Image
                            fill
                            src={image}
                            alt="Hotel image"
                            className="object-cover"
                          />
                          <Button
                            onClick={() => handleImageDelete(image)}
                            type="button"
                            size="icon"
                            className="absolute right-5 top-5"
                          >
                            {shouldImageDelete} ?{" "}
                            <Loader2 color="white" className="animate-spin" /> :{" "}
                            <XCircle color="white" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center max-w-[400px] p-12 border-2 border-dashed border-primary/50 rounded mt-4">
                          <UploadButton
                            endpoint="imageUploader"
                            onClientUploadComplete={(res) => {
                              console.log("Files: ", res);
                              setImage(res[0].url);
                              toast({
                                title: "Upload completed",
                                description:
                                  "Your hotel image has been successfully uploaded.",
                              });
                            }}
                            onUploadError={(error: Error) => {
                              toast({
                                variant: "destructive",
                                title: "Image upload failed",
                                description: error.message,
                              });
                            }}
                          />
                        </div>
                      )}
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {/* right div  */}
            <div className="flex-1 flex flex-col gap-5 ">Right</div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AddHotelForm;
