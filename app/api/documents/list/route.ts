import { NextResponse } from 'next/server';
import { readdir, readFile } from 'fs/promises';
import { join, extname } from 'path';

export async function GET() {
    try {
        const docDir = join(process.cwd(), 'public', 'doc');
        const files = await readdir(docDir);

        const documents = await Promise.all(files
            .filter(file => extname(file) === '.md')
            .map(async (file) => {
                const filePath = join(docDir, file);
                const content = await readFile(filePath, 'utf-8');

                let docId = file.replace('.md', ''); // Default to filename without extension
                let title = file.replace('.md', ''); // Default to filename without extension
                let parentDocument = undefined; // Initialize parentDocument

                // Parse YAML front matter
                if (content.startsWith('---')) {
                    const endOfFrontMatter = content.indexOf('---', 3);
                    if (endOfFrontMatter !== -1) {
                        const frontMatter = content.substring(3, endOfFrontMatter);
                        const idMatch = frontMatter.match(/id:\s*(.+)/);
                        if (idMatch && idMatch[1]) {
                             docId = idMatch[1].trim();
                        }
                        const titleMatch = frontMatter.match(/title:\s*(.+)/);
                        if (titleMatch && titleMatch[1]) {
                            title = titleMatch[1].trim().replace(/^"|"$|^'|'$/g, '');
                        }
                        // Parse parentDocument
                        const parentMatch = frontMatter.match(/parentDocument:\s*(.+)/);
                         if (parentMatch && parentMatch[1]) {
                             parentDocument = parentMatch[1].trim();
                         }
                    }
                }
                
                return {
                    _id: docId,
                    title: title,
                    parentDocument: parentDocument, // Include parentDocument in the response
                    content: '', 
                    createdAt: '', 
                    updatedAt: '', 
                };
            }));
        
        return NextResponse.json(documents);
    } catch (error) {
        console.error('Error listing documents:', error);
        return NextResponse.json(
            { error: 'Failed to list documents' },
            { status: 500 }
        );
    }
} 