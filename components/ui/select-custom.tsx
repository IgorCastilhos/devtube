import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";

interface SelectCategoryProps {
    options: { label: string; value: string; }[];
    value?: string;
    onChange?: (value: string) => void;
}

export const SelectCategory = ({options, value, onChange}: SelectCategoryProps) => {
    return (
        <Select defaultValue={value} onValueChange={onChange}>
            <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione uma opção"/>
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    {options.map((option) => {
                        return (
                            <SelectItem key={option.value} value={option.value
                            }>{option.label}</SelectItem>
                        )
                    })}
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}
