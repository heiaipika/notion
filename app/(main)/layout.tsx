"use client";

import { Navigation } from "./_components/navigation";
import { ModeToggle } from "@/components/mode-toggle";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="h-full flex dark:bg-[#1f1f1f]">
            <Navigation />
            <main className="flex-1 h-full overflow-y-auto">
                {children}
                <div className="fixed top-4 right-4 z-50">
                    <ModeToggle />
                </div>
            </main>
        </div>
    )
}

export default MainLayout