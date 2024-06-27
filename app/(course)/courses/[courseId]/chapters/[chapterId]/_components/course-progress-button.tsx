"use client";

import {Button} from "@/components/ui/button";
import {CheckCircle, XCircle} from "lucide-react";
import {useRouter} from "next/navigation";
import {useConfettiStore} from "@/hooks/use-confetti-store";
import {useState} from "react";
import {toast} from "@/components/ui/use-toast";
import axios from "axios";

interface CourseProgressButtonProps {
    chapterId: string;
    courseId: string;
    isCompleted?: boolean;
    nextChapterId?: string;
}

export const CourseProgressButton = ({chapterId, courseId, isCompleted, nextChapterId}: CourseProgressButtonProps) => {

    const router = useRouter();
    const confetti = useConfettiStore();
    const [isLoading, setIsLoading] = useState(false);
    const Icon = isCompleted ? XCircle : CheckCircle;
    const onClick = async () => {
        try {
            setIsLoading(true);

            await axios.put(`/api/courses/${courseId}/chapters/${chapterId}/progress`, {
                isCompleted: !isCompleted,
            });

            if (!isCompleted && !nextChapterId) {
                confetti.onOpen();
            }

            if (!isCompleted && nextChapterId) {
                router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
            }

            toast({
                variant: "success",
                title: "Progresso atualizado com sucesso!",
            })
            router.refresh();
        } catch {
            toast({
                variant: "destructive",
                title: "Uh oh! Algo deu errado.",
                description: "Houve um problema .",
            })
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Button
            onClick={onClick}
            disabled={isLoading}
            type={"button"}
            variant={isCompleted ? "outline" : "success"}
            className="w-full md:w-auto"
        >
            {isCompleted ? "Não completado" : "Marcar como completo"}
            <Icon className="h-4 w-4 ml-2"/>
        </Button>
    )
}
