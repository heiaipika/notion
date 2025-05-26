import { cn } from "@/lib/utils"
import { ChevronsLeft, MenuIcon, Plus, PlusCircle, Search, Settings, Trash } from "lucide-react"
import { useParams, usePathname, useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { useMediaQuery } from "usehooks-ts"
import { Item } from "./item"
import { toast } from "sonner"
import { DocumentList } from "./document-list"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { saveNewDocument } from "./document-page"
import { ElementRef } from "react";

export const Navigation = () => {
    const router = useRouter()
    const isMobile = useMediaQuery('(max-width: 414px)')
    const isResizingRef = useRef(false)
    const sidebarRef = useRef<ElementRef<"aside">>(null)
    const navbarRef = useRef<ElementRef<"div">>(null)
    const [isReseting, setIsReseting] = useState(false)
    const [isCollapsed, setIsCollapsed] = useState(isMobile)
    const pathname = usePathname()
    const params = useParams()

    useEffect(() => {
        if (isMobile) {
            collapse()
        } else {
            resetWidth()
        }
    }, [isMobile])

    useEffect(() => {
        if (isMobile) {
            collapse()
        }
    }, [pathname, isMobile])

    const handleMouseDown = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.preventDefault()
        event.stopPropagation()
        isResizingRef.current = true
        document.addEventListener("mousemove", handleMouseMove)
        document.addEventListener("mouseup", handleMouseUp)
    }

    const handleMouseMove = (event: MouseEvent) => {
        if (!isResizingRef.current) return
        let newWidth = event.clientX
        if (newWidth < 240) newWidth = 240
        if (newWidth > 480) newWidth = 480
        if (sidebarRef.current && navbarRef.current) {
            sidebarRef.current.style.width = `${newWidth}px`
            navbarRef.current.style.setProperty("left", `${newWidth}px`)
            navbarRef.current.style.setProperty("width", `calc(100% - ${newWidth}px)`)
        }
    }

    const handleMouseUp = (_: MouseEvent) => {
        isResizingRef.current = false
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
    }

    const resetWidth = () => {
        if (sidebarRef.current && navbarRef.current) {
            setIsCollapsed(false)
            setIsReseting(true)
            sidebarRef.current.style.width = isMobile ? "100%" : "240px"
            navbarRef.current.style.setProperty("left", isMobile ? "100%" : `240px`)
            navbarRef.current.style.setProperty("width", isMobile ? "0" : `calc(100% - 240px)`)
            setTimeout(() => setIsReseting(false), 300);
        }
    }

    const collapse = () => {
        if (sidebarRef.current && navbarRef.current) {
            setIsCollapsed(true)
            setIsReseting(true)
            sidebarRef.current.style.width = "0"
            navbarRef.current.style.setProperty("left", "0")
            navbarRef.current.style.setProperty("width", "100%")
            setTimeout(() => setIsReseting(false), 300);
        }
    }

    const handleExpand = () => {
        resetWidth();
    }

    const handleCreate = () => {
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

    return (<>
        <aside ref={sidebarRef} className={
            cn("group/sidebar h-full bg-secondary overflow-y-auto relative flex w-60 flex-col z-[99999]",
                isReseting && "transition-all ease-in-out duration-300",
                isMobile && "w-0"
            )
        }>
            {!isCollapsed && (
                <div role="button" onClick={collapse} className={
                    cn("h-6 w-6 text-muted-foreground rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 absolute top-3 right-2 opacity-0 group-hover/sidebar:opacity-100")
                }>
                    <ChevronsLeft className="h-6 w-6" />
                </div>
            )}
            
            <div>
                <Item onClick={handleCreate}
                    label="New Page"
                    icon={PlusCircle}
                />
            </div>
            <div className="mt-4">
                <DocumentList />

                <Popover>
                    <PopoverTrigger className="w-full">
                        <Item
                            label="Trash"
                            icon={Trash}
                        />
                    </PopoverTrigger>
                    <PopoverContent
                        className="p-0 w-72"
                        side={isMobile ? 'bottom' : 'right'}>
                    </PopoverContent>
                </Popover>
            </div>
            <div onClick={resetWidth} onMouseDown={handleMouseDown} className="opacity-0 group-hover/sidebar:opacity-100 transition
            cursor-ew-resize absolute h-full w-1 bg-primary/10 right-0 top-0" />
        </aside>
        <div ref={navbarRef} className={
            cn("absolute top-0 z-[99999]",
                isReseting && "transition-all ease-in-out duration-300",
                isMobile && "w-full",
                !isMobile && isCollapsed && "left-0 w-full",
                !isMobile && !isCollapsed && "left-60 w-[calc(100% - 240px)]"
            )
        }>
            {!isMobile && isCollapsed && (
                 <div role="button" onClick={handleExpand} className={
                    cn("h-6 w-6 text-muted-foreground rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 absolute top-3 left-3")
                 }>
                     <MenuIcon className="h-6 w-6" />
                 </div>
            )}
        </div>
    </>)
}