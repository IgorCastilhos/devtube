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
        <Button className="w-full md:w-auto" size={"sm"} onClick={onClick} disabled={isLoading}>
            Inscrever-se {formatPrice(price)}
        </Button>
    )
}
