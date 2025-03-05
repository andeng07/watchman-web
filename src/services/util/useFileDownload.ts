import { useEffect } from 'react';

export const useFileDownload = (blob: Blob | null, fileName: string) => {
    useEffect(() => {
        const downloadFile = () => {
            if (!blob) return;  // Ensure the blob exists

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        };

        if (blob) {
            downloadFile();
        }
    }, [blob, fileName]);
};
