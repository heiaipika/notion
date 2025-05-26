import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { ChevronDown, ChevronRight, LucideIcon, MoreHorizontal, Plus, Trash } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { saveNewDocument } from "./document-page"

interface ItemProps {
    id?: string
    documentIcon?: string
    active?: boolean
    expanded?: boolean
    isSearch?: boolean
    level?: number
    label: string
    onClick?: () => void
    onExpand?: () => void
    icon: LucideIcon
}

export const Item = ({ label, onClick, icon: Icon, level, active, documentIcon, id, isSearch, onExpand, expanded }: ItemProps) => {
    const router = useRouter()

    const onCreate = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.stopPropagation()
        if (!id) return;
        
        const newDocId = Date.now().toString()
        const newDoc = {
            _id: newDocId,
            title: "Untitled",
            parentDocument: id, // Ensure parentDocument is string
            icon: "📄",
            content: "# Untitled\n\nStart writing your markdown content here...",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }

        saveNewDocument(newDoc)

        if (!expanded) {
            onExpand?.()
        }
        router.push(`/documents/${newDocId}`)
        toast.success("New note created")
    }

    const onArchive = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.stopPropagation()
        if (!id) return;

        const storedDocs = localStorage.getItem('documents')
        if (storedDocs) {
            const docs = JSON.parse(storedDocs)
            const updatedDocs = docs.filter((doc: any) => doc._id !== id)
            localStorage.setItem('documents', JSON.stringify(updatedDocs))
        }

        router.push(`/documents`)
        toast.success("Note moved to trash!")
    }

    const handleExpand = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.stopPropagation()
        onExpand?.()
    }

    const ChevronIcon = expanded ? ChevronDown : ChevronRight

    return (<>
        <div onClick={onClick} role="button" style={{ paddingLeft: level ? `${12 * (level + 1)}px` : "12px" }} className={
            cn("group min-h-[27px] text-sm py-1 pr-3 w-full hover:bg-primary/5 flex items-center text-muted-foreground font-medium",
                active && "bg-primary/5 text-primary"
            )
        }>
            {!!id && (
                <div onClick={handleExpand} role="button" className="h-full rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 mr-1">
                    <ChevronIcon className="h-4 w-4 shrink-0 text-muted-foreground/50" />
                </div>
            )}
            {documentIcon ? (
                <div className="shrink-0 h-[18px] mr-2">{documentIcon}</div>
            ) : (
                <Icon className="shrink-0 h-[18px] w-[18px] mr-2 text-muted-foreground" />
            )}
            <span className="truncate">
                {label}
            </span>
            {isSearch && (
                <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                    <span className="text-xs">⌘</span>k
                </kbd>
            )}
            {!!id && (
                <div className="ml-auto flex items-center gap-x-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={e => e.stopPropagation()}>
                            <div role="button" className="opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:bg-neutral-600">
                                <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" side="right" forceMount>
                            <DropdownMenuItem onClick={onArchive}>
                                <div className="text-red-500 flex items-center">
                                    <Trash className="w-4 h-4 mr-2" /> delete
                                </div>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <div role="button" onClick={onCreate} className="opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:bg-neutral-600">
                        <Plus className="h-4 w-4 text-muted-foreground" />
                    </div>
                </div>
            )}
        </div>
    </>)
}

Item.Skeleton = function ItemSkeleton({ level }: { level: number }) {
    return (
        <div
            style={{ paddingLeft: level ? `${12 * (level + 1) + 25}px` : "12px" }}
            className="flex gap-x-2 py-[3px]"
        >
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-[30%]" />
        </div>
    )
} 