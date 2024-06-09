import { useCreateMyRestaurant, useGetMyRestaurant, useUpdateMyRestaurant } from "@/api/MyRestaurantApi";
import ManageRestaurantForm from "@/forms/manage-restaurant-form/ManageRestaurantForm";


const ManageRestaurantPage = () => {
    const { createRestaurant, isLoading: isCreateLoading } = useCreateMyRestaurant();
    const { restaurant } = useGetMyRestaurant();
    const{ updateRestaurant, isLoading: isUpdateLoading } = useUpdateMyRestaurant();

    // isEditing checks whether a restaurant exists or not
    // !!restaurant will be true if a restaurant exists or else false if restaurant does not exists
    const isEditing = !!restaurant;

  return (
    <ManageRestaurantForm 
    restaurant = {restaurant} 
    onSave={isEditing ? updateRestaurant : createRestaurant} 
    isLoading={isCreateLoading || isUpdateLoading} />
  )
}

export default ManageRestaurantPage
