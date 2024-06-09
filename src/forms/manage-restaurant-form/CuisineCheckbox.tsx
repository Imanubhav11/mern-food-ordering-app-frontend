import { Checkbox } from "@/components/ui/checkbox";
import { FormControl, FormItem, FormLabel } from "@/components/ui/form";
import { ControllerRenderProps, FieldValues } from "react-hook-form"

type Props = {
    cuisine: string,
    field: ControllerRenderProps<FieldValues, "cuisines">;
};

//field.value = [pasta,pizza]
//cuisine = "pizza" (true as the field.value contains a cuisine and with correspondence to that checkbox will be improvised )

const CuisineCheckbox = ({ cuisine, field }:Props) => {
    return(
        <FormItem className="flex flex-row items-center space-x-1 space-y-0 mt-2">
            <FormControl>
                <Checkbox
                    className='bg-white'                     //field.value = [pasta,pizza] cuisine = "pizza" (true as the field.value contains a cuisine and with correspondence to that checkbox will be improvised )
                    checked={field.value.includes(cuisine)} 
                    onCheckedChange={(checked) => {
                        if(checked){
                            field.onChange([...field.value,cuisine]); //add the cuisine to the list of cuisines that the user has chosen
                        }
                        else{
                            field.onChange(field.value.filter((value: string) => value !== cuisine)); // this will filter/delete out the cuisine from the list of cuisines chosen by the user 
                        }
                    }}
                />     

            </FormControl>
            <FormLabel className="text-sm font-normal">{cuisine}</FormLabel>
        </FormItem>
    )
};

export default CuisineCheckbox;