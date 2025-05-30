import JSZip from 'jszip';

interface FileContent {
  path: string;
  content: string;
}

export async function createZipFromFiles(files: FileContent[]): Promise<Blob> {
  const zip = new JSZip();

  files.forEach(({ path, content }) => {
    zip.file(path, content);
  });

  return await zip.generateAsync({ type: 'blob' });
} 