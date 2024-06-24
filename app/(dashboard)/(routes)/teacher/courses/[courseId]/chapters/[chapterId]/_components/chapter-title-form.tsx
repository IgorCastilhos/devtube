"use client";

import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Button} from "@/components/ui/button";
import {Pencil} from "lucide-react";
import {useState} from "react";
import {Form, FormControl, FormField, FormItem, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {toast} from "@/components/ui/use-toast";
import axios from "axios";
import {useRouter} from "next/navigation";

interface ChapterTitleFormProps {
    initialData: {
        title: string;
    };
    courseId: string;
    chapterId: string;
}

const formSchema = z.object({
    title: z.string().min(1)
})

export const ChapterTitleForm = ({initialData, courseId, chapterId}: ChapterTitleFormProps) => {

    const [isEditing, setIsEditing] = useState(false);

    const toggleEdit = () => setIsEditing((current) => !current);

    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData
    })

    const {isSubmitting, isValid} = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values);
            toast({
                variant: "success",
                title: "Capítulo atualizado com sucesso!",
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

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Título do Capítulo
                <Button onClick={toggleEdit} variant={"ghost"}>
                    {isEditing ? (
                        <>Cancelar</>
                    ) : (
                        <>
                            <Pencil className="h-4 w-4 mr-2"/>
                            Editar título
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                <p className="text-sm mt-2">
                    {initialData.title}
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
