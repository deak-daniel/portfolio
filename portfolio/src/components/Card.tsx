import type { ReactNode } from "react";

export default function Card({children, colStart, colEnd, rowStart, rowEnd}:{children:ReactNode;colStart:number;colEnd:number;rowStart:number;rowEnd:number}) {
    return (
        <div className="bg-gray-900 border border-white-500 p-2 z-10 rounded-xl" style={{gridRowStart:rowStart, gridRowEnd:rowEnd, gridColumnStart:colStart, gridColumnEnd:colEnd}}>
            {children}
        </div>
    );
}