import GithubLogo from "./GithubLogo";

export type DialogContent = {
    title: string;
    content: string;
    githubLink?: string;
}

export function Dialog({ dialogProps, onClose }: { dialogProps: DialogContent; onClose: () => void; }) {
    return (
        <div>
            <dialog open={true} className="fixed top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] z-100 flex flex-col gap-4 bg-[#0b1121] rounded-lg border border-gray-700 p-4">
                <div className="flex flex-col gap-2">
                    <div className="grow-1">
                        <span className="text-[24px] font-bold text-white">{dialogProps.title}</span>
                    </div>
                    <div className="grow-2">
                        <span className="text-bold text-gray-500">{dialogProps.content}</span>
                    </div>
                </div>
                <hr className="text-gray-700"></hr>
                <div className="flex flex-row justify-end gap-2">
                    {dialogProps.githubLink ? (
                        <a target='_blank' className='hover:cursor-pointer hover:bg-[#0b1121] flex flex-row font-[400] gap-2 items-center px-6 py-3 border border-slate-700 rounded-lg hover:scale-102 max-w-max transition-all bg-black text-white z-10' href={dialogProps.githubLink}>
                            <GithubLogo size={20} />
                            View on GitHub
                        </a>
                    ) : (
                        <a className=' hover:cursor-pointer hover:bg-[#0b1121] flex flex-row font-[400] gap-2 items-center px-6 py-3 border border-slate-700 rounded-lg hover:scale-102 max-w-max transition-all bg-black text-white z-10'>
                            Soon...
                        </a>
                    )}
                    <button className=' hover:cursor-pointer flex flex-row font-[400] gap-2 items-center px-6 py-3 border border-slate-700 rounded-lg hover:scale-102 max-w-max transition-all bg-gray-200 text-black' onClick={onClose}>Close</button>
                </div>
            </dialog>
            <div className="bg-black/30  backdrop-blur-sm w-full h-full fixed top-0 left-0 z-90"></div>
        </div>)
}