"use client";

import {z} from "zod";
import axios from "axios";
import {Pencil, PlusCircle, Video} from "lucide-react";
import {useState} from "react";
import {toast} from "@/components/ui/use-toast";
import {useRouter} from "next/navigation";
import {Chapter, MuxData} from "@prisma/client";
import {Button} from "@/components/ui/button";
import {FileUpload} from "@/components/file-upload";
import MuxPlayer from "@mux/mux-player-react/lazy";

interface ChapterVideoFormProps {
    initialData: Chapter & { muxData?: MuxData | null };
    courseId: string;
    chapterId: string;
}

const formSchema = z.object({
    videoUrl: z.string().min(1),
})

export const ChapterVideoForm = ({
                                     initialData,
                                     courseId,
                                     chapterId
                                 }: ChapterVideoFormProps) => {
    const [isEditing, setIsEditing] = useState(false);

    const toggleEdit = () => setIsEditing((current) => !current);

    const router = useRouter();

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values);
            toast({
                variant: "success",
                title: "Capítulo atualizado",
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
                Vídeo do Curso
                <Button onClick={toggleEdit} variant={"ghost"}>
                    {isEditing && (
                        <>Cancelar</>
                    )}
                    {!isEditing && !initialData.videoUrl && (
                        <>
                            <PlusCircle className="h-4 w-4 mr-2"/>
                            Adicionar vídeo
                        </>
                    )}
                    {!isEditing && initialData.videoUrl && (
                        <>
                            <Pencil className="h-4 w-4 mr-2"/>
                            Editar vídeo
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                !initialData.videoUrl ? (
                    <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
                        <Video className="h-10 w-10 text-slate-500"/>
                    </div>
                ) : (
                    <div className="relative aspect-video mt-2">
                        <MuxPlayer
                            playbackId={initialData.muxData?.playbackId || ""}
                            loading={"viewport"}
                            style={{aspectRatio: 16 / 9}}
                        />
                    </div>
                )
            )}
            {isEditing && (
                <div>
                    <FileUpload
                        endpoint={"chapterVideo"}
                        onChange={(url) => {
                            if (url) {
                                onSubmit({videoUrl: url});
                            }
                        }}
                    />
                    <div className="text-xs text-muted-foreground mt-4">
                        Envie o vídeo desse capítulo
                    </div>
                </div>
            )}
            {initialData.videoUrl && !isEditing && (
                <div className="text-xs text-muted-foreground mt-2">
                    Os vídeos podem levar algum tempo para serem processados. Se você não vê o vídeo, atualize a página.
                </div>
            )}
        </div>
    )
}
