"use client";

import * as z from "zod";
import axios from "axios";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {Pencil} from "lucide-react";
import {useState} from "react";
import {toast} from "@/components/ui/use-toast";
import {useRouter} from "next/navigation";
import {Course} from "@prisma/client";
import {Form, FormControl, FormField, FormItem, FormMessage} from "@/components/ui/form";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {Combobox} from "@/components/ui/combobox";
import prisma from "@/lib/db";

interface CategoryFormProps {
    initialData: Course
    courseId: string;
    options: { label: string; value: string; }[];
}

const getCategories = async () => {
    const categories = await prisma.category.findMany({
        orderBy: { name: "asc" },
    });
    return categories;
};

const formSchema = z.object({
    categoryId: z.string().min(1),
});

export const CategoryForm = ({initialData, courseId, options}: CategoryFormProps) => {

    const [isEditing, setIsEditing] = useState(false);

    const toggleEdit = () => setIsEditing((current) => !current);

    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            categoryId: initialData?.categoryId || ""
        },
    });

    const {isSubmitting, isValid} = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/courses/${courseId}`, values);
            toast({
                variant: "success",
                title: "Categoria atualizada",
            })
            toggleEdit();
            router.refresh();
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Uh oh! Algo deu errado.",
                description: "Houve um problema com a sua requisição.",
            })
        }
    }

    // Check if the course already has an option
    const selectedOption = options.find(option => option.value === initialData.categoryId);


    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Categoria do curso
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing ? (
                        <>Cancelar</>
                    ) : (
                        <>
                            <Pencil className="h-4 w-4 mr-2"/>
                            Editar categoria
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                <p className={cn(
                    "text-sm mt-2",
                    !initialData.categoryId && "text-slate-500 italic"
                )}>
                    {selectedOption?.label || "Sem categoria"}
                </p>
            )}
            {isEditing && (
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4 mt-4"
                    >
                        <FormField
                            control={form.control}
                            name="categoryId"
                            render={({field}) => (
                                <FormItem>
                                    <FormControl>
                                        {/*<Combobox options={getCategories().map((category) => ({*/}
                                        {/*    label: category.name,*/}
                                        {/*    value: category.id,*/}
                                        {/*}))}*/}
                                        {/*          {...field}/>*/}
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <div className="flex items-center gap-x-2">
                            <Button
                                disabled={!isValid || isSubmitting}
                                type="submit"
                            >
                                Salvar
                            </Button>
                        </div>
                    </form>
                </Form>
            )}
        </div>
    )
}
