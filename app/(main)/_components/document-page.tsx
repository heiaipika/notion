"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import { Plus } from "lucide-react";

interface Document {
    _id: string;
    title: string;
    content: string;
    parentDocument?: string;
    icon?: string;
    createdAt: string;
    updatedAt: string;
}

const loadDocFromFile = async (docId: string, filename: string) => {
    try {
        const response = await fetch(`/doc/${filename}.md`);
        if (response.ok) {
            const content = await response.text();
            
            let id = docId;
            let title = filename;
            let actualContent = content;
            
            if (content.startsWith('---')) {
                const endOfFrontMatter = content.indexOf('---', 3);
                if (endOfFrontMatter !== -1) {
                    const frontMatter = content.substring(3, endOfFrontMatter);
                    const idMatch = frontMatter.match(/id:\s*(.+)/);
                    if (idMatch && idMatch[1]) {
                         id = idMatch[1].trim();
                    }
                    const titleMatch = frontMatter.match(/title:\s*(.+)/);
                    if (titleMatch && titleMatch[1]) {
                        title = titleMatch[1].trim().replace(/^"|"$|^'|'$/g, '');
                    }
                    actualContent = content.substring(endOfFrontMatter + 3).trim();
                }
            }
            
            return {
                _id: id,
                title,
                content: actualContent,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
        }
    } catch (error) {
        console.error('Error loading document:', error);
    }
    return null;
};

const saveDocToFile = async (docId: string, content: string, oldTitle: string, newTitle: string) => {
    try {
        const response = await fetch('/api/documents/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                docId,
                content,
                oldTitle,
                newTitle
            }),
        });
        if (!response.ok) {
            throw new Error('Failed to save document');
        }
    } catch (error) {
        console.error('Error saving document:', error);
        throw error;
    }
};

export const saveNewDocument = async (newDoc: Document) => {
    await saveDocToFile(newDoc._id, newDoc.content, newDoc.title, newDoc.title);
    
    const docData = localStorage.getItem('@doc');
    const docs = docData ? JSON.parse(docData) : [];
    localStorage.setItem('@doc', JSON.stringify([...docs, newDoc]));

    // Trigger a custom event to notify document list
    window.dispatchEvent(new CustomEvent('documentTitleUpdated'));
};

export const DocumentPage = () => {
    const params = useParams();
    const [document, setDocument] = useState<Document | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [content, setContent] = useState("");
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [title, setTitle] = useState("");

    useEffect(() => {
        const loadDocument = async () => {
            const docId = params.documentId as string;

            const response = await fetch('/api/documents/list');
            if (!response.ok) {
                 console.error('Failed to fetch document list');
                 return;
            }
            const documents = await response.json();
            const docInfo = documents.find((doc: any) => doc._id === docId);

            if (!docInfo) {
                console.error(`Document with id ${docId} not found`);
                const docData = localStorage.getItem('@doc');
                if (docData) {
                    const docs = JSON.parse(docData);
                    const doc = docs.find((d: Document) => d._id === docId);
                    if (doc) {
                        setDocument(doc);
                        setContent(doc.content);
                        setTitle(doc.title);
                    }
                }
                return;
            }

            const fileDoc = await loadDocFromFile(docId, docInfo.title);
            if (fileDoc) {
                setDocument(fileDoc);
                setContent(fileDoc.content);
                setTitle(fileDoc.title);
                return;
            }

            const docData = localStorage.getItem('@doc');
            if (docData) {
                const docs = JSON.parse(docData);
                const doc = docs.find((d: Document) => d._id === docId);
                if (doc) {
                    setDocument(doc);
                    setContent(doc.content);
                    setTitle(doc.title);
                }
            }
        };

        loadDocument();
    }, [params.documentId]);

    const saveDocument = async (updatedDoc: Document) => {
        try {
            await saveDocToFile(updatedDoc._id, updatedDoc.content, document?.title || updatedDoc.title, updatedDoc.title);
            
            const docData = localStorage.getItem('@doc');
            const docs = docData ? JSON.parse(docData) : [];
            const updatedDocs = docs.map((d: Document) => 
                d._id === updatedDoc._id ? updatedDoc : d
            );
            localStorage.setItem('@doc', JSON.stringify(updatedDocs));
        } catch (error) {
            toast.error("Failed to save document");
            throw error;
        }
    };

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setContent(e.target.value);
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
    };

    const handleTitleSave = async () => {
        if (!document) return;

        const updatedDoc = {
            ...document,
            title,
            updatedAt: new Date().toISOString()
        };

        try {
            await saveDocToFile(updatedDoc._id, content, document.title, title); 
            setDocument(updatedDoc);
            toast.success("Title updated!");
            setIsEditingTitle(false);

            // Trigger a custom event to notify document list
            window.dispatchEvent(new CustomEvent('documentTitleUpdated'));

        } catch (error) {
            toast.error("Failed to update title");
        }
    };

    const handleSave = async () => {
        if (!document) return;

        const updatedDoc = {
            ...document,
            content,
            updatedAt: new Date().toISOString()
        };

        try {
            await saveDocToFile(updatedDoc._id, updatedDoc.content, document.title, document.title);
            setDocument(updatedDoc);
            toast.success("Document saved!");
        } catch (error) {
            toast.error("Failed to save document");
        }
    };

    if (!document) {
        return <div>Loading...</div>;
    }

    return (
        <div className="h-full p-8">
            <div className="max-w-3xl mx-auto">
                <div className="flex items-center justify-between mb-4">
                    {isEditingTitle ? (
                        <div className="flex items-center gap-x-2">
                            <input
                                value={title}
                                onChange={handleTitleChange}
                                className="text-2xl font-bold bg-transparent border-b border-primary focus:outline-none focus:border-primary/50"
                                onBlur={handleTitleSave}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        handleTitleSave();
                                    }
                                }}
                                autoFocus
                            />
                        </div>
                    ) : (
                        <h1 
                            className="text-2xl font-bold cursor-pointer hover:bg-primary/5 px-2 py-1 rounded"
                            onClick={() => setIsEditingTitle(true)}
                        >
                            {document.title}
                        </h1>
                    )}
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                    >
                        {isEditing ? "Preview" : "Edit"}
                    </button>
                </div>
                {isEditing ? (
                    <div className="space-y-4">
                        <textarea
                            value={content}
                            onChange={handleContentChange}
                            className="w-full h-[calc(100vh-200px)] p-4 border rounded-md font-mono"
                            placeholder="Write your markdown content here..."
                        />
                        <button
                            onClick={handleSave}
                            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                        >
                            Save
                        </button>
                    </div>
                ) : (
                    <div className="prose dark:prose-invert max-w-none">
                        <ReactMarkdown>{content}</ReactMarkdown>
                    </div>
                )}
            </div>
        </div>
    );
}; 