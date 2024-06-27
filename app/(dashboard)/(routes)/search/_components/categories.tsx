"use client";

import {Category, Course} from "@prisma/client";
import {IconType} from "react-icons";
import {FaHtml5, FaReact} from "react-icons/fa";
import {CategoryItem} from "@/app/(dashboard)/(routes)/search/_components/category-item";
import {IoLogoCss3} from "react-icons/io";
import {IoLogoJavascript} from "react-icons/io5";
import {BiLogoPostgresql} from "react-icons/bi";
import {FaDocker, FaGolang} from "react-icons/fa6";
import {SiMysql, SiPostman} from "react-icons/si";
import {MdOutlineConstruction} from "react-icons/md";
import {PiTreeStructure} from "react-icons/pi";

interface CategoriesProps {
    items: Category[];
}

const iconMap: Record<Course["title"], IconType> = {
    "Estrutura de Dados": MdOutlineConstruction,
    "Algoritmos": PiTreeStructure,
    "HTML": FaHtml5,
    "CSS": IoLogoCss3,
    "JavaScript": IoLogoJavascript,
    "React": FaReact,
    "PostgreSQL": BiLogoPostgresql,
    "Go": FaGolang,
    "MySQL": SiMysql,
    "Docker": FaDocker,
    "Postman": SiPostman,
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
