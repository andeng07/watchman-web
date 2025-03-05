import {useState, useEffect, useRef} from "react";
import {createPortal} from "react-dom";
import {Input} from "@/components/ui/input";
import {SearchIcon, XIcon} from "lucide-react";
import {Badge} from "@/components/ui/badge.tsx";

type SearchFilterProps<T> = {
    searchLabel: string
    fetchFunction: (query: string) => Promise<T[]>;
    getLabel: (item: T) => string;
    getDescription?: (item: T) => string;
    getKey: (item: T) => string | number;
    selected: T[]; // Lifted state
    setSelected: (items: T[]) => void; // Lifted setter
};

export default function SearchFilter<T>(
    {
        searchLabel,
        fetchFunction,
        getLabel,
        getDescription = () => "",
        getKey,
        selected,
        setSelected,
    }: SearchFilterProps<T>) {
    const [search, setSearch] = useState("");
    const [options, setOptions] = useState<T[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!search) return setOptions([]);

        const fetchData = async () => {
            try {
                const data = await fetchFunction(search);
                setOptions(data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [search, fetchFunction]);

    const toggleSelection = (item: T) => {
        setSelected((prev) => {
            const exists = prev.some((i) => getKey(i) === getKey(item));
            return exists ? prev.filter((i) => getKey(i) !== getKey(item)) : [...prev, item];
        });
    };

    const clearSearch = () => {
        setSearch("");
        setOptions([]);
        setIsOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node) &&
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (containerRef.current) {
            const computedStyle = window.getComputedStyle(containerRef.current);
            if (computedStyle.overflow !== "visible") {
                console.warn(
                    "⚠️ Parent container has `overflow: hidden`, which may cause dropdown overlap issues."
                );
            }
        }
    }, []);

    const combinedOptions = [
        ...selected,
        ...options.filter((item) => !selected.some((sel) => getKey(sel) === getKey(item))),
    ];

    return (
        <div ref={containerRef} className="w-full max-w-sm relative bg-white">
            <div className="relative">
                <Input
                    type="search"
                    placeholder={searchLabel}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onFocus={() => setIsOpen(true)}
                    className="pr-20 rounded-md border border-gray-300 py-2 pl-4 bg-secondary"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 space-x-2">
                    {selected.length > 0 && <Badge variant="entry">{selected.length}</Badge>}
                    {search && (
                        <button onClick={clearSearch} className="text-gray-400 hover:text-gray-600">
                            <XIcon className="h-5 w-5"/>
                        </button>
                    )}
                    <SearchIcon className="h-5 w-5 text-gray-400"/>
                </div>
            </div>

            {isOpen && combinedOptions.length > 0 &&
                createPortal(
                    <div
                        ref={dropdownRef}
                        className="absolute left-0 right-0 mt-2 max-h-48 overflow-y-auto rounded-md border bg-white shadow-lg z-50"
                        style={{
                            position: "fixed",
                            top: containerRef.current?.getBoundingClientRect().bottom,
                            left: containerRef.current?.getBoundingClientRect().left,
                            width: containerRef.current?.offsetWidth,
                        }}
                    >
                        <div className="py-2">
                            {combinedOptions.map((item) => (
                                <label
                                    key={getKey(item)}
                                    className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                >
                                    <input
                                        type="checkbox"
                                        className="mr-2"
                                        checked={selected.some((i) => getKey(i) === getKey(item))}
                                        onChange={() => toggleSelection(item)}
                                    />
                                    <div>
                                        <div className="font-medium">{getLabel(item)}</div>
                                        <div className="text-sm text-gray-500">{getDescription(item)}</div>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>,
                    document.body
                )}
        </div>
    );
}
