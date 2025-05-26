import { NextResponse } from 'next/server';
import { writeFile, unlink } from 'fs/promises';
import { join } from 'path';

export async function POST(req: Request) {
    try {
        const { docId, content, oldTitle, newTitle, parentDocument } = await req.json();
        
        const docDir = join(process.cwd(), 'public', 'doc');
        
        if (oldTitle && newTitle && oldTitle !== newTitle) {
            const oldFilePath = join(docDir, `${oldTitle}.md`);
            try {
                await unlink(oldFilePath);
                console.log(`Deleted old file: ${oldFilePath}`);
            } catch (error) {
                console.error(`Failed to delete old file ${oldFilePath}:`, error);
            }
        }
        
        let fileContent = `---
id: ${docId}
title: ${newTitle}
`;

        if (parentDocument) {
            fileContent += `parentDocument: ${parentDocument}
`;
        }

        fileContent += `---

${content}`;
        
        const filePath = join(docDir, `${newTitle}.md`);
        await writeFile(filePath, fileContent, 'utf-8');
        
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error saving document:', error);
        return NextResponse.json(
            { error: 'Failed to save document' },
            { status: 500 }
        );
    }
} 