import Image from 'next/image'
export const Heroes = () => {
    return (<div className="flex flex-col items-center justify-center max-w-5xl">
        <div className="flex items-center">
            <div className="relative w-[300px] h-[300px] sm:h-[350px] sm:w-[350px] md:h-[400px] md:w-[400px]">
                <Image fill className='object-contain dark:hidden' src="/png/home.png" alt='shouye' />
                <Image fill className='object-contain hidden dark:block' src="/png/home.png" alt='shouye' />
            </div>
        </div>
    </div>)
}