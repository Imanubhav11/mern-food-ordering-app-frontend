import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import DetailsSection from "./DetailsSection";
import { Separator } from "@/components/ui/separator";
import CuisinesSection from "./CuisinesSection";
import MenuSection from "./MenuSection";
import LoadingButton from "@/components/LoadingButton";
import { Button } from "@/components/ui/button";
import ImageSection from "./ImageSection";
import { Restaurant } from "@/types";
import { useEffect } from "react";




const formSchema= z.object({
    restaurantName: z.string({
        required_error: "restaurant name is required",
    }),
    city: z.string({
        required_error: "city name is required",
    }),
    country: z.string({
        required_error: "country name is required",
    }),
    deliveryPrice: z.coerce.number({
        required_error: "delivery price is required",
        invalid_type_error: "must be a valid number",
    }),
    estimatedDeliveryTime: z.coerce.number({
        required_error: "estimated delivery time is required",
        invalid_type_error: "must be a valid number",
    }),
    cuisines: z.array(z.string()).nonempty({
        message: "please select one item",
    }),
    menuItems: z.array(z.object({
        name: z.string().min(1, "name is required"),
        price: z.coerce.number().min(1,"price is required"),
    })),
    imageUrl: z.string().optional(),
    imageFile: z.instanceof(File, {message: "image is required"}).optional(),
}).refine(data => data.imageUrl || data.imageFile, {
    message: "Either the image URL or the image file must be provided",
    path: ["imageFile"],
})

type RestaurantFormData = z.infer<typeof formSchema>

type Props= {
    restaurant?: Restaurant,
    onSave: (restaurantFormData: FormData) => void;
    isLoading: boolean,
}

const ManageRestaurantForm = ({ onSave, isLoading, restaurant }: Props) => {
    const form = useForm<RestaurantFormData>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        cuisines: [],
        menuItems: [{ name: "", price: 0 }],
      },
    });

    useEffect(() => {
        if(!restaurant){
            return;
        }

        //converting the price from its lowest denomination
        const deliveryPriceFormatted = parseInt((restaurant.deliveryPrice/100).toFixed(2));

        const menuItemsFormatted = restaurant.menuItems.map((item) => ({
            //copy of the current menu item
            ...item,
            price: parseInt((item.price/100).toFixed(2)),
        }));

        const updatedRestaurant = {
            //copying all the existing restaurant properties
            ...restaurant,
            deliveryPrice: deliveryPriceFormatted,
            menuItems : menuItemsFormatted,

        };

        form.reset(updatedRestaurant);

    },[form, restaurant]);

    const onSubmit = (formDataJson: RestaurantFormData) => {
        //TODO - convert formDataJSON to a new FormData object

        const formData = new FormData();

        formData.append("restaurantName",formDataJson.restaurantName);
        formData.append("city",formDataJson.city);
        formData.append("country",formDataJson.country);


        // 1 INR = 100 paisa
        //try to convert the curency to its lowest denomination so that it will be easy for the backend to perform its operation
        // hence not making the calculation complicated
        formData.append(
            "deliveryPrice",
            (formDataJson.deliveryPrice*100).toString()
        );

        //converting the delivery time to string as this request will be a http request to the backend server and it can only handle 
        // strings not time format of data
        formData.append("estimatedDeliveryTime",
            (formDataJson.estimatedDeliveryTime).toString()
        );

        formDataJson.cuisines.forEach((cuisine, index) => {
            formData.append(`cuisines[${index}]`,cuisine);
        });

        //here in also the price getting converted to the lowest denomination and then getting converted to string before getting 
        //processed
        formDataJson.menuItems.forEach((menuItem,index) => {
            formData.append(`menuItems[${index}][name]`,menuItem.name);
            formData.append(`menuItems[${index}][price]`,(menuItem.price * 100).toString());
        });

        if(formDataJson.imageFile){
            formData.append(`imageFile`,formDataJson.imageFile);
        }

        onSave(formData);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 bg-gray-50 rounded-lg md:p-10">
                <DetailsSection />
                <Separator />
                <CuisinesSection />
                <Separator/>
                <MenuSection/>
                <Separator/>
                <ImageSection/>
                {isLoading ? <LoadingButton/> : <Button type="submit">Submit</Button>}
            </form>
        </Form>
    )

}

export default ManageRestaurantForm;