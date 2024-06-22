import { useAuth0 } from "@auth0/auth0-react";
import { useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import LoadingButton from "./LoadingButton";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import UserProfileForm, { UserFormData } from "@/forms/UserProfileForm";
import { useGetMyUser } from "@/api/MyUserApi";

type Props = {
    onCheckout: (userFormData: UserFormData) => void;
    disabled: boolean;
    isLoading: boolean
};

const CheckoutButton = ({onCheckout,disabled,isLoading}:Props) => {
    const { 
            isAuthenticated, 
            isLoading: isAuthLoading, 
            loginWithRedirect 
        } = useAuth0();

        const { pathname } = useLocation();

        const { currentUser, isLoading: isGetUserLoading } = useGetMyUser();

        const onLogin  = async() => {
            await loginWithRedirect({
                appState: {
                    returnTo: pathname,
                },
            });
        }

        if(!isAuthenticated){
            return(
                <Button onClick={onLogin} className="bg-orange-500">Log in to checkout</Button>
            );
        }

        if(isAuthLoading || !currentUser || isLoading){
            return(
                <LoadingButton />
            )
        }

        return(
            <Dialog>
                <DialogTrigger>
                    <Button disabled={disabled} className="bg-orange-500 flex-1">Go to Checkout</Button>
                </DialogTrigger>
                <DialogContent className="max-w-[425px] md: min-w-[700px] bg-gray-50">
                    <UserProfileForm
                        title="Confirm Delivery Details"
                        buttonText="continue to payment"
                        currentUser={currentUser}
                        //when you click on the checkout button the onCheckout will be triggered which will redirect to the user profile form
                        onSave={onCheckout}
                        isLoading={isGetUserLoading} />
                </DialogContent>

            </Dialog>
        )
};

export default CheckoutButton;