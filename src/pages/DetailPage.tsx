
import { useCreateCheckoutSession } from "@/api/OrderApi";
import { usegetMyRestaurant } from "@/api/RestaurantApi";
import CheckoutButton from "@/components/CheckoutButton";
import MenuItem from "@/components/MenuItem";
import OrderSummary from "@/components/OrderSummary";
import RestaurantInfo from "@/components/RestaurantInfo";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardFooter } from "@/components/ui/card";
import { UserFormData } from "@/forms/UserProfileForm";
import { MenuItem as MenuItemType } from "@/types";
import { Loader } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";


export type CartItem = {
    _id: string,
    name: string,
    price: number,
    quantity: number,
};


const DetailPage = () => {
    const { restaurantId } = useParams();
    const { restaurant, isLoading } = usegetMyRestaurant(restaurantId);
    const { createCheckoutSession, isLoading: isCheckoutLoading } = useCreateCheckoutSession();

    const [cartItems,setCartItems] = useState<CartItem[]>(() => {
        const storedCartItems = sessionStorage.getItem(`cartItems-${restaurantId}`);
        //if the storedCart items exists the you have to convert the stringified json to cartItem array and then return else return []empty array
        return storedCartItems ? JSON.parse(storedCartItems) : [];
    });

    // [{
    //     _id: item1,
    //     name: cheese pizza,
    //     price: 240,
    //     quantity: 1,
    //  },
    //  {
    //     _id: item2,
    //     name: bbq pizza,
    //     price: 140,
    //     quantity: 1,
    //  }]

    const addToCart = (menuItem: MenuItemType) => {
        setCartItems((prevCartItems) => {
            // 1. check if the item already exists in the cart 
            const exisitingCartItem = prevCartItems.find(
                (cartItem) => cartItem._id === menuItem._id
            );

            let updatedCartItems;

            // 2. if item already exists in the cart update the quantity
            if(exisitingCartItem){
                updatedCartItems = prevCartItems.map((cartItem) => 
                    cartItem._id === menuItem._id 
                        ? {...cartItem, quantity: cartItem.quantity + 1}
                        : cartItem
                );
            }
            else{
                updatedCartItems = [
                    ...prevCartItems,
                {
                    _id: menuItem._id,
                    name: menuItem.name,
                    price: menuItem.price,
                    quantity: 1,
                },
            ];
            }

            // sessionStorage is a web storage API provided by browsers. It allows you to store data for 
            // the duration of the page session. Data stored in sessionStorage is cleared when the page session ends, which typically happens when the page is closed.

            //if at all we didn't use the session storage the local storage clears the data on refreshing of the page 
            //which results in losing the data for current order as well as the check out button dissapears
            sessionStorage.setItem(
                `cartItems-${restaurantId}`,
                //It stores the updatedCartItems array/object in sessionStorage under a unique key that includes the restaurantId.
                // By using JSON.stringify, it ensures that the updatedCartItems is converted into a JSON string, which is a valid format for storage in sessionStorage.
                JSON.stringify(updatedCartItems),
            );

            // 3. if item doesnot exist in the cart add it as a new item
            return updatedCartItems;

        });
    };


    const removeFromCart = (cartItem: CartItem) => {
        setCartItems((prevCartItems)=>{
            const updatedCartItems = prevCartItems.filter(
                (item) => cartItem._id !== item._id
            );

            sessionStorage.setItem(
                `cartItems-${restaurantId}`,
                JSON.stringify(updatedCartItems),
            );

            return updatedCartItems;
        });
    };

    const onCheckout = async(userFormData: UserFormData) => {

        if(!restaurant){
            return;
        }

        const checkoutData = {
            cartItems: cartItems.map((cartItem) => ({
                menuItemId: cartItem._id,
                name: cartItem.name,
                quantity: cartItem.quantity.toString(),
            })),
            restaurantId:restaurant._id,
            deliveryDetails: {
                name: userFormData.name,
                city: userFormData.city,
                addressLine1: userFormData.addressLine1,
                country: userFormData.country,
                email: userFormData.email as string,
            }
        };

        const data = await createCheckoutSession(checkoutData);
        window.location.href  = data.url;
    };


    if(isLoading || !restaurant){
        return(
            <Loader/>
        )
    }

    return(
        <div className="flex flex-col gap-10">
            <AspectRatio ratio={16/5}>
                <img 
                    src={restaurant.imageUrl} 
                    className="rounded-md object-cover h-full w-full" />
            </AspectRatio>
            <div className="grid md:grid-cols-[4fr_2fr] gap-5 md:px-32">
                <div className="flex flex-col gap-1">
                    <RestaurantInfo restaurant={restaurant} />
                    <span className="text-2xl font-bold tracking-tight mt-3">Menu</span>
                    {restaurant.menuItems.map((menuItem) => (
                        <MenuItem menuItem={menuItem} addToCart={() => addToCart(menuItem)} />
                    ))}
                </div>

                <div>
                    <Card>
                        <OrderSummary 
                            restaurant={restaurant} 
                            cartItems={cartItems} 
                            removeFromCart={removeFromCart} />
                            <CardFooter>
                                <CheckoutButton isLoading= {isCheckoutLoading} disabled={cartItems.length === 0} onCheckout={onCheckout} />
                            </CardFooter>
                    </Card>
                    
                </div>
            </div>
        </div>
    )
}

export default DetailPage
