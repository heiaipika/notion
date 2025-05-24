"use client";

import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/clerk-react";
import { PlusCircle } from "lucide-react";
import Image from "next/image";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";



const DocumnetsPage = () => {
    const { user } = useUser()
    const router = useRouter()
    const onCreate = () => {


    }

    return (<div className="h-full flex flex-col items-center justify-center space-y-4">
        <Image width="300" height="300" alt="empty" src="/note.svg" className="dark:hidden" />
        <Image width="300" height="300" alt="empty" src="/note-dark.svg" className="hidden dark:block" />
        <h2>Welcome to {user?.firstName}</h2>
        <Button onClick={onCreate}>
            <PlusCircle className="w-4 h-4 mr-2" /> Create a note
        </Button>
    </div>)
}
export default DocumnetsPage;