"use client";

import {Loader2, Lock} from "lucide-react";
import {useState} from "react";
import MuxPlayer from "@mux/mux-player-react";
import {cn} from "@/lib/utils";
import {useRouter} from "next/navigation";
import {useConfettiStore} from "@/hooks/use-confetti-store";
import {toast} from "@/components/ui/use-toast";
import axios from "axios";

interface VideoPlayerProps {
    playbackId: string;
    courseId: string;
    chapterId: string;
    nextChapterId?: string;
    isLocked: boolean;
    completeOnEnd: boolean;
    title: string;
}

export const VideoPlayer = ({
                                playbackId,
                                courseId,
                                chapterId,
                                nextChapterId,
                                isLocked,
                                completeOnEnd,
                                title
                            }: VideoPlayerProps) => {

    const [isReady, setIsReady] = useState(false);
    const router = useRouter();
    const confetti = useConfettiStore();
    const onEnd = async () => {
        try {
            if (completeOnEnd) {
                await axios.put(`/api/courses/${courseId}/chapters/${chapterId}/progress`, {
                    isCompleted: true,
                });

                if (!nextChapterId) {
                    confetti.onOpen();
                }
                toast({
                    variant: "success",
                    title: "Progresso atualizado com sucesso!",
                })
                router.refresh();

                if (nextChapterId) {
                    router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
                }
            }
        } catch {
            toast({
                variant: "destructive",
                title: "Uh oh! Algo deu errado.",
                description: "Houve um problema .",
            })
        }
    }

    return (
        <div className="relative aspect-video">
            {!isReady && !isLocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
                    <Loader2 className="h-8 w-8 animate-spin text-secondary"/>
                </div>
            )}
            {isLocked && (
                <div
                    className="absolute inset-0 flex items-center justify-center bg-slate-800 flex-col gap-y-2 text-secondary">
                    <Lock
                        className="h-8 w-8"
                    />
                    <p className="text-sm">
                        Esse capítulo está bloqueado
                    </p>
                </div>
            )}
            {!isLocked && (
                <MuxPlayer
                    title={title}
                    className={cn(
                        !isReady && "hidden",
                    )}
                    onCanPlay={() => setIsReady(true)}
                    onEnded={onEnd}
                    autoPlay
                    playbackId={playbackId}
                />
            )}
        </div>
    )
}
