import { useRef } from "react";
import { Input } from "@/components/ui/input";
import { SearchIcon, XIcon } from "lucide-react";

type SearchFilterProps = {
    searchLabel: string;
    searchValue: string;
    setSearchValue: (value: string) => void;
};

export default function SearchFilter2({ searchLabel, searchValue, setSearchValue }: SearchFilterProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    const clearSearch = () => {
        setSearchValue("");
    };

    return (
        <div ref={containerRef} className="w-full max-w-sm relative bg-white">
            <div className="relative">
                <Input
                    type="search"
                    placeholder={searchLabel}
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    className="pr-20 rounded-md border border-gray-300 py-2 pl-4 bg-secondary"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 space-x-2">
                    {searchValue && (
                        <button onClick={clearSearch} className="text-gray-400 hover:text-gray-600">
                            <XIcon className="h-5 w-5"/>
                        </button>
                    )}
                    <SearchIcon className="h-5 w-5 text-gray-400"/>
                </div>
            </div>
        </div>
    );
}
