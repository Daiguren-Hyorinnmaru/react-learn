import React, { useState, useRef, useEffect } from "react";
import { ParameterCondition } from "./types";

interface CustomSelectProps {
    options: ParameterCondition[];
    selectedCode: string;
    onChange: (code: string) => void;
    placeholder?: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
                                                       options,
                                                       selectedCode,
                                                       onChange,
                                                       placeholder = "-- Select --",
                                                   }) => {
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const selected = options.find((opt) => opt.code === selectedCode);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative inline-block w-64" ref={wrapperRef}>
            <button
                className="w-full px-4 py-2 text-left border rounded  hover:bg-gray-100"
                onClick={() => setIsOpen((prev) => !prev)}
            >
                {selected ? selected.label : placeholder}
            </button>
            {isOpen && (
                <div className="absolute z-10 mt-1 w-full border rounded shadow">
                    {options.map((opt) => (
                        <div
                            key={opt.code}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer relative group"
                            onClick={() => {
                                onChange(opt.code);
                                setIsOpen(false);
                            }}
                        >
                            {opt.label}
                            <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 hidden group-hover:block bg-gray-800 text-white text-xs p-2 rounded shadow max-w-xs z-20">
                                {opt.description}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CustomSelect;
