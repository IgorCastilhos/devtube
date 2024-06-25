"use client";

import {Button} from "@/components/ui/button";
import {Trash} from "lucide-react";
import {ConfirmModal} from "@/components/models/confirm-modal";
import {useState} from "react";
import {toast} from "@/components/ui/use-toast";
import axios from "axios";
import {useRouter} from "next/navigation";

interface ChapterActionsProps {
    disabled: boolean;
    courseId: string;
    chapterId: string;
    isPublished: boolean;
}

export const ChapterActions = ({disabled, courseId, chapterId, isPublished}: ChapterActionsProps) => {
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);

    const onClick = async () => {
        try {
            setIsLoading(true);

            if (isPublished) {
                await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}/unpublish`, {isPublished: false});
                toast(
                    {
                        variant: "success",
                        title: "Capítulo retirado",
                    }
                )
            } else {
                await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}/publish`, {isPublished: true});
                toast(
                    {
                        variant: "success",
                        title: "Capítulo publicado",
                    }
                )
            }
            router.refresh();
        } catch (error) {
            toast(
                {
                    variant: "destructive",
                    title: "Uh oh! Algo deu errado.",
                }
            )
        } finally {
            setIsLoading(false);
        }
    }

    const onDelete = async () => {
        try {
            setIsLoading(true);
            await axios.delete(`/api/courses/${courseId}/chapters/${chapterId}`);
            toast(
                {
                    variant: "success",
                    title: "Capítulo removido",
                }
            )
            router.refresh();
            router.push(`/teacher/courses/${courseId}`);
        } catch (error) {
            toast(
                {
                    variant: "destructive",
                    title: "Uh oh! Algo deu errado.",
                }
            )
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex items-center gap-x-2">
            <Button
                onClick={onClick}
                disabled={disabled || isLoading}
                variant={"outline"}
                size={"sm"}
            >
                {isPublished ? "Remover dos publicados" : "Publicar"}
            </Button>
            <ConfirmModal onConfirm={onDelete}>
                <Button size={"sm"} disabled={isLoading}>
                    <Trash className={"h-4 w-4"}/>
                </Button>
            </ConfirmModal>
        </div>
    )
}
