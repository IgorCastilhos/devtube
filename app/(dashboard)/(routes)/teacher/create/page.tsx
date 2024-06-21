"use client";

import * as z from "zod";
import axios from "axios";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";
import {toast} from "@/components/ui/use-toast";
import {ToastAction} from "@/components/ui/toast";

const formSchema = z.object({
    title: z.string().min(1, {
        message: "Título é obrigatório",
    })
})

const CreatePage = () => {
    const ROUTER = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
        }
    })

    const {isSubmitting, isValid} = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const response = await axios.post("/api/courses", values);
            ROUTER.push(`/teacher/courses/${response.data.id}`);
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Uh oh! Algo deu errado.",
                description: "Houve um problema com a sua requisição.",
                action: <ToastAction altText="Try again">Tente de novo</ToastAction>,
            })
        }
    }

    return (
        <div className="max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6">
            <div>
                <h1 className="text-2xl">
                    Nome do curso
                </h1>
                <p className="text-sm text-slate-600">
                    Como tu gostaria de chamar o teu curso? Não se preocupe, poderá mudar isso depois.
                </p>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-8 mt-8"
                    >
                        <FormField
                            control={form.control}
                            name="title"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>
                                        Título do Curso
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isSubmitting}
                                            placeholder="ex.: Curso avançado de React"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        O que tu irá ensinar nesse curso?
                                    </FormDescription>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <div className="flex items-center gap-x-2">
                            <Link href={"/"}>
                                <Button
                                    type={"button"}
                                    variant={"ghost"}
                                >
                                    Cancelar
                                </Button>
                            </Link>
                            <Button
                                type={"submit"}
                                disabled={!isValid || isSubmitting}
                            >
                                Continuar
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
}

export default CreatePage;
