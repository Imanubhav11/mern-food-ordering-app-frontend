
import { useGetMyOrders } from "@/api/OrderApi";
import OrderStatusDetail from "@/components/OrderStatusDetail";
import OrderStatusHeader from "@/components/OrderStatusHeader";
import { Loader } from "lucide-react";

const OrderStatusPage = () => {
    const { orders, isLoading }= useGetMyOrders();


    if(isLoading){
        return(
            <Loader/>
        )
 
    }

    if(!orders || orders.length === 0){
        return "No Orders Found!";
    }


    return(
        <div className="space-y-10">
            {orders.map((order) => 
                <div className="space-y-10 bg-gray-50 p-10 rounded-lg">
                    <OrderStatusHeader order={order}  />
                    <div className="grid gap-10 md: grid-cols-2">
                        <OrderStatusDetail order={order} />
                    </div>
                </div>
            )}
        </div>
    )
};

export default OrderStatusPage;