"use client";

import {Button} from "@/components/ui/button";
import {formatPrice} from "@/lib/format";
import {useState} from "react";
import {toast} from "@/components/ui/use-toast";
import axios from "axios";

interface CourseEnrollButtonProps {
    price: number;
    courseId: string;
}

export const CourseEnrollButton = ({price, courseId}: CourseEnrollButtonProps) => {
    const [isLoading, setIsLoading] = useState(false);

    const onClick = async () => {
        try {
            setIsLoading(true);

            const response = await axios.post(`/api/courses/${courseId}/checkout`);

            window.location.assign(response.data.url);
        } catch {
            toast({
                variant: "destructive",
                title: "Algo deu errado",
            })
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Button className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-500 text-white" size={"sm"} onClick={onClick} disabled={isLoading}>
            Inscrever-se {formatPrice(price)}
        </Button>
    )
}
