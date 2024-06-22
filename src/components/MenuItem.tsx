
import type { MenuItem } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

type Props = {
    menuItem: MenuItem;
    addToCart: () => void;
};

const MenuItem = ({ menuItem, addToCart }: Props) => {
  return (
    <Card className="mt-5 cursor-pointer font-sans shadow-[0_9px_0_rgb(0,0,0)] hover:shadow-[0_4px_0px_rgb(0,0,0)] hover:translate-y-1 transition-all rounded"
        onClick={addToCart} >
      <CardHeader>
        <CardTitle>Name: {menuItem.name}</CardTitle>
      </CardHeader>
      <CardContent className="font-bold font-serif">
        Price: ₹{(menuItem.price / 100).toFixed(2)}
      </CardContent>
    </Card>
  );
};

export default MenuItem;