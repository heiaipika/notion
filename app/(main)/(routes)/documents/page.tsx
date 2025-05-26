"use client";

import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { saveNewDocument } from "@/app/(main)/_components/document-page";

const DocumnetsPage = () => {
    const router = useRouter()

    const onCreate = () => {
        const documentId = Date.now().toString()
        const newDoc = {
            _id: documentId,
            title: "Untitled",
            parentDocument: undefined,
            icon: "📄",
            content: "# Untitled\n\nStart writing your markdown content here...",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }

        saveNewDocument(newDoc)
        router.push(`/documents/${documentId}`)
        toast.success("New note created!")
    }

    return (<div className="h-full flex flex-col items-center justify-center space-y-4">
        <Image width="300" height="300" alt="empty" src="/note.svg" className="dark:hidden" />
        <Image width="300" height="300" alt="empty" src="/note-dark.svg" className="hidden dark:block" />
        <h2>Welcome to your Hotion</h2>
        <Button onClick={onCreate}>
            <PlusCircle className="w-4 h-4 mr-2" /> Create a note
        </Button>
    </div>)
}
export default DocumnetsPage;