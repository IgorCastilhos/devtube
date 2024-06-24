"use client";

import {z} from "zod";
import axios from "axios";
import {ImageIcon, Pencil, PlusCircle} from "lucide-react";
import {useState} from "react";
import {toast} from "@/components/ui/use-toast";
import {useRouter} from "next/navigation";
import {Course} from "@prisma/client";
import Image from "next/image";
import {Button} from "@/components/ui/button";
import {FileUpload} from "@/components/file-upload";

interface ImageFormProps {
    initialData: Course;
    courseId: string;
}

const formSchema = z.object({
    imageUrl: z.string().min(1, {
        message: "Imagem é obrigatória",
    }),
})

export const ImageForm = ({
                              initialData,
                              courseId
                          }: ImageFormProps) => {
    const [isEditing, setIsEditing] = useState(false);

    const toggleEdit = () => setIsEditing((current) => !current);

    const router = useRouter();

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/courses/${courseId}`, values);
            toast({
                variant: "success",
                title: "Imagem atualizada com sucesso!",
            })
            toggleEdit();
            router.refresh();
        } catch {
            toast({
                variant: "destructive",
                title: "Uh oh! Algo deu errado.",
            })
        }
    }

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4 dark:bg-gray-800">
            <div className="font-medium flex items-center justify-between">
                Imagem do Curso
                <Button onClick={toggleEdit} variant={"ghost"}>
                    {isEditing && (
                        <>Cancelar</>
                    )}
                    {!isEditing && !initialData.imageUrl && (
                        <>
                            <PlusCircle className="h-4 w-4 mr-2"/>
                            Adicionar imagem
                        </>
                    )}
                    {!isEditing && initialData.imageUrl && (
                        <>
                            <Pencil className="h-4 w-4 mr-2"/>
                            Editar imagem
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                !initialData.imageUrl ? (
                    <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
                        <ImageIcon className="h-10 w-10 text-slate-500"/>
                    </div>
                ) : (
                    <div className="relative aspect-video mt-2">
                        <Image
                            alt={"Upload"}
                            fill
                            className="object-cover rounded-md"
                            src={initialData.imageUrl}
                        />
                    </div>
                )
            )}
            {isEditing && (
                <div>
                    <FileUpload
                        endpoint={"courseImage"}
                        onChange={(url) => {
                            if (url) {
                                onSubmit({imageUrl: url});
                            }
                        }}
                    />
                    <div className="text-xs text-muted-foreground mt-4">
                        Recomendado aspect ratio de 16:9
                    </div>
                </div>
            )}
        </div>
    )
}
