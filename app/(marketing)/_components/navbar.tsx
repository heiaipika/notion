"use client";
import { Logo } from "./logo";
import { useScrollTop } from "@/hooks/use-scroll-top";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useConvexAuth } from "convex/react";
import { SignInButton, UserButton } from "@clerk/clerk-react";
import { Spinner } from "@/components/spinner";
import { Ghost, User } from "lucide-react";

export const Navbar = () => {
    const {isAuthenticated,isLoading}=useConvexAuth();
    const scrolled = useScrollTop();
    return (
        <div
            className={cn(
                "z-50 bg-background fixed top-0 flex items-center w-full p-6 dark:bg-[#1F1F1F]",
                scrolled && "border-b shadow-sm"
            )}>
            <Logo />
            <div className="md:ml-auto md:justify-end justify-between w-full flex items-center gap-x-2">
                {isLoading&&(
                    <Spinner/>
                )}
                {!isAuthenticated&&!isLoading&&(
                    <>
                        <SignInButton mode="modal">
                            <Button variant="ghost" size={"sm"}>
                                Log in
                            </Button>
                        </SignInButton>
                        <SignInButton mode="modal">
                            <Button size={"sm"}>
                                Get Hotion free
                            </Button>
                        </SignInButton>
                    </>
                )}
                {isAuthenticated&&!isLoading&&(
                    <>
                     <Button variant="ghost" size="sm" asChild>
                        <Link href="/documents">
                          Enter Hotion
                        </Link>
                     </Button>
                     <UserButton />
                    </>
                )}
                <ModeToggle/>
            </div>
        </div>
    );
};

