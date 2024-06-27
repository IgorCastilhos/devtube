"use client";

import {Category, Course} from "@prisma/client";
import {IconType} from "react-icons";
import {FaHtml5} from "react-icons/fa";
import {FcFilmReel, FcMultipleDevices, FcMusic, FcOldTimeCamera, FcSportsMode} from "react-icons/fc";
import {CategoryItem} from "@/app/(dashboard)/(routes)/search/_components/category-item";

interface CategoriesProps {
    items: Category[];
}

const iconMap: Record<Course["title"], IconType> = {
    "Ciência da computação": FcMultipleDevices,
    "Cinema": FcFilmReel,
    "Música": FcMusic,
    "Gastronomia": FaHtml5,
    "Futebol": FcSportsMode,
    "Arte": FcOldTimeCamera,
}

export const Categories = ({items}: CategoriesProps) => {
    return (
        <div className={"flex items-center gap-x-2 overflow-x-auto pb-2"}>
            {items.map((item) => (
                <CategoryItem
                    key={item.id}
                    label={item.name}
                    icon={iconMap[item.name]}
                    value={item.id}
                />
            ))}
        </div>
    )
}
