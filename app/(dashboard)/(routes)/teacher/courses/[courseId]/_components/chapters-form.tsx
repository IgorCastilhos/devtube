"use client";

import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Button} from "@/components/ui/button";
import {PlusCircle} from "lucide-react";
import {useState} from "react";
import {Form, FormControl, FormField, FormItem, FormMessage} from "@/components/ui/form";
import {toast} from "@/components/ui/use-toast";
import axios from "axios";
import {useRouter} from "next/navigation";
import {cn} from "@/lib/utils";
import {Chapter, Course} from "@prisma/client";
import {Input} from "@/components/ui/input";

interface ChaptersFormProps {
    initialData: Course & { chapters: Chapter[] };
    courseId: string;
}

const formSchema = z.object({
    title: z.string().min(1)
})

export const ChaptersForm = ({initialData, courseId}: ChaptersFormProps) => {
    const [isCreating, setIsCreating] = useState(false);
    const [isUpdating, setisUpdating] = useState(false);

    const toggleCreating = () => {
        setIsCreating((current) => !current)
    };

    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
        }
    })

    const {isSubmitting, isValid} = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.post(`/api/courses/${courseId}/chapters`, values);
            toast({
                variant: "success",
                title: "Capítulo criado com sucesso!",
            })
            toggleCreating();
            router.refresh();
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Uh oh! Algo deu errado.",
                description: "Houve um problema com a sua requisição.",
            })
        }
    }

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Capítulos do Curso
                <Button onClick={toggleCreating} variant={"ghost"}>
                    {isCreating ? (
                        <>Cancelar</>
                    ) : (
                        <>
                            <PlusCircle className="h-4 w-4 mr-2"/>
                            Adicionar um capítulo
                        </>
                    )}
                </Button>
            </div>
            {isCreating && (
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4 mt-4"
                    >
                        <FormField
                            control={form.control}
                            name="title"
                            render={({field}) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            disabled={isSubmitting}
                                            placeholder="Introdução ao curso"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <Button
                            disabled={!isValid || isSubmitting}
                            type="submit"
                        >
                            Criar
                        </Button>
                    </form>
                </Form>
            )}
            {!isCreating && (
                <div className={cn("text-sm mt-2", !initialData.chapters.length && "text-slate-500 italic")}>
                    {!initialData.chapters.length && "Sem capítulos"}
                    {/*    Todo Adicionar lista de capitulos*/}
                </div>
            )}
            {!isCreating && (
                <p className="text-xs text-muted-foreground mt-4">
                    Segure e arraste os capítulos para reordená-los.
                </p>
            )}
        </div>
    )
}

// Todo 4:23:11
