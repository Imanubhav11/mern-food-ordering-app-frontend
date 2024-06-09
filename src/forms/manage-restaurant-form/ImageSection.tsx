import { AspectRatio } from "@/components/ui/aspect-ratio";
import { FormControl, FormDescription, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";

const ImageSection = () => {
   const { control, watch } = useFormContext();

   const existingImageUrl = watch('imageUrl')

   return(
        <div className="space-y-2">
            <div>
                <h2 className="text-2xl font-bold">Image</h2>
                <FormDescription>
                Add an image that will be displayed on your restaurant listing in the
                search results. Adding a new image will overwrite the existing one.
                </FormDescription>
            </div>

            <div className="flex flex-col gap-8 md:w-[50%]">
                {existingImageUrl && (
                    <AspectRatio ratio={16/9}>
                        <img src={existingImageUrl} alt="Image" className="rounded-md object-cover h-full w-full" />
                    </AspectRatio>
                )}
                <FormField 
                    control={control} 
                    name="imageFile" 
                    render={({field}) => 
                    <FormItem>
                        <FormControl>
                            <Input 
                                className="bg-white" 
                                type="file" 
                                accept=".jpg, .jpeg, .png" 
                                //if there is any change in the image file that the user wants to do 
                                //then we make sure that the user chooses atleast one file and the first file of their chosen file
                                // is to be returned else nothing will be returned
                                onChange={(event) => field.onChange(event.target.files ? event.target.files[0] : null)}
                            />
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                } />
            </div>
        </div>
   )
    
}

export default ImageSection;