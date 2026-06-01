import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/src/ui/components/ui/select"

type DropdownItem = {
    label: string;
    value: string;
};

type Props = {
    value?: string;
    item?: string,
    onChange: (value: string) => void;
    title: string;
    items: DropdownItem[];
    placeholder?: string; // Opcional: para customizar o placeholder
}

export function GenericSelect({ title, items, onChange, value, placeholder }: Props) {
  return (
    // Select precisa receber o value e o onValueChange
    <Select value={value || ""} onValueChange={onChange}> 
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder || "Selecione..."} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{title}</SelectLabel>
          {items.map(item => (
            <SelectItem
                key={item.value}
                value={item.value}
            >
                {item.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}