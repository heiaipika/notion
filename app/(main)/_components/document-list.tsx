"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Item } from "./item";
import { cn } from "@/lib/utils";
import { FileIcon } from "lucide-react";

interface Document {
    _id: string;
    title: string;
    parentDocument?: string;
    icon?: string;
}

interface DocumentListProps {
    parentDocumentId?: string;
    level?: number;
}

export const DocumentList = ({ parentDocumentId, level = 0 }: DocumentListProps) => {
    const params = useParams();
    const router = useRouter();
    const [expanded, setExpanded] = useState<Record<string, boolean>>({});
    const [documents, setDocuments] = useState<Document[]>([]);

    // Function to load documents
    const loadDocuments = async () => {
        try {
            const response = await fetch('/api/documents/list');
            if (response.ok) {
                const allDocs: Document[] = await response.json();
                const filteredDocs = allDocs.filter((doc: Document) => 
                    doc.parentDocument === parentDocumentId
                );
                setDocuments(filteredDocs);
            } else {
                console.error('Failed to fetch documents from API');
                // Fallback to localStorage - also adjust filtering
                const docData = localStorage.getItem('@doc');
                if (docData) {
                    const allDocs = JSON.parse(docData);
                    const filteredDocs = allDocs.filter((doc: Document) => 
                        doc.parentDocument === parentDocumentId
                    );
                    setDocuments(filteredDocs);
                }
            }
        } catch (error) {
            console.error('Error loading documents:', error);
            const docData = localStorage.getItem('@doc');
            if (docData) {
                const allDocs = JSON.parse(docData);
                const filteredDocs = allDocs.filter((doc: Document) => 
                    doc.parentDocument === parentDocumentId
                );
                setDocuments(filteredDocs);
            }
        }
    };

    useEffect(() => {
        // Initial load
        loadDocuments();

        // Event listener for title updates
        const handleTitleUpdated = () => {
            console.log('Document title updated, refreshing list...');
            loadDocuments(); // Reload documents when event is triggered
        };

        window.addEventListener('documentTitleUpdated', handleTitleUpdated);

        // Cleanup the event listener on component unmount
        return () => {
            window.removeEventListener('documentTitleUpdated', handleTitleUpdated);
        };

    }, [parentDocumentId]); // Re-run effect if parentDocumentId changes

    const onExpand = (documentId: string) => {
        setExpanded((prevExpand) => ({
            ...prevExpand,
            [documentId]: !prevExpand[documentId]
        }));
    };

    const onRedirect = (documentId: string) => {
        router.push(`/documents/${documentId}`);
    };

    if (documents === undefined) {
        return (
            <>
                <Item.Skeleton level={level} />
                {level === 0 && (
                    <>
                        <Item.Skeleton level={level} />
                        <Item.Skeleton level={level} />
                    </>
                )}
            </>
        );
    }

    return (
        <>
            <p
                style={{ paddingLeft: level ? `${12 * (level + 1) + 25}px` : "12px" }}
                className={cn(
                    "hidden text-sm font-medium text-muted-foreground/80",
                    expanded && "last:block",
                    level === 0 && "hidden"
                )}
            >
                No pages inside
            </p>
            {documents?.map((document) => (
                <div key={document._id}>
                    <Item
                        id={document._id}
                        onClick={() => onRedirect(document._id)}
                        label={document.title}
                        icon={FileIcon}
                        documentIcon={document.icon}
                        active={params.documentId === document._id}
                        onExpand={() => onExpand(document._id)}
                        expanded={expanded[document._id]}
                        level={level}
                    />
                    {expanded[document._id] && (
                        <DocumentList parentDocumentId={document._id} level={level + 1} />
                    )}
                </div>
            ))}
        </>
    );
};