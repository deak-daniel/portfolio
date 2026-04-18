export default function Navbar({ isFloating }: { isFloating: boolean }) {

    return (
        <>
            <div className={`flex flex-row gap-4 bg-[#0b1121] self-center`}>
                <a className="font-mali hover:text-shadow-sm tracking-[10%] hover:text-shadow-[#ffffff] bg-[#0b1121] hover:cursor-pointer transition-all p-2 rounded-lg" href="#about">About</a>
                <a className="font-mali hover:text-shadow-sm tracking-[10%] hover:text-shadow-[#ffffff] bg-[#0b1121] hover:cursor-pointer transition-all p-2 rounded-lg" href="#projects">Projects</a>
                <a className="font-mali hover:text-shadow-sm tracking-[10%] hover:text-shadow-[#ffffff] bg-[#0b1121] hover:cursor-pointer transition-all p-2 rounded-lg" href="#skills">Skills</a>
                <a className="font-mali hover:text-shadow-sm tracking-[10%] hover:text-shadow-[#ffffff] bg-[#0b1121] hover:cursor-pointer transition-all p-2 rounded-lg" href="#contact">Contact</a>
            </div>
            <div id="floating-navbar" className={`flex flex-row gap-4 bg-gray-200 self-center text-black border border-slate-700 rounded-full p-4 ${isFloating ? 'fixed top-4 z-50' : 'hidden'}`}>
                <div className="relative flex flex-row gap-4">
                    <a className="relative font-mali tracking-[10%] hover:cursor-pointer transition-all p-2 rounded-lg after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-sky-500 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300" href="#about">About</a>
                    <a className="relative font-mali tracking-[10%] hover:cursor-pointer transition-all p-2 rounded-lg after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-sky-500 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300" href="#projects">Projects</a>
                    <a className="relative font-mali tracking-[10%] hover:cursor-pointer transition-all p-2 rounded-lg after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-sky-500 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300" href="#skills">Skills</a>
                    <a className="relative font-mali tracking-[10%] hover:cursor-pointer transition-all p-2 rounded-lg after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-sky-500 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300" href="#contact">Contact</a>
                </div>
            </div>
        </>
    );

}