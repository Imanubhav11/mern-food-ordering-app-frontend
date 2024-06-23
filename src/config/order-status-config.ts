import { OrderStatus } from "@/types";

type OrderStatusInfo = {
    label: string;
    value: OrderStatus;
    progressValue: number;
}

export const ORDER_STATUS: OrderStatusInfo[] = [
    { 
        label: "Placed", 
        value: "placed", 
        progressValue: 0
    },

    { 
        label: "Waiting for the restarant to confirm the order", 
        value: "paid", 
        progressValue: 25
    },

    {
        label: "your Order is being prepared",
        value: "inProgress",
        progressValue: 50
    },

    {
        label: "Out for delivery",
        value: "outForDelivery",
        progressValue: 75  
    },

    {
        label: "Delivered",
        value: "delivered",
        progressValue: 100
    },

];