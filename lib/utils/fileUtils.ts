// File handling utilities

export interface FileInfo {
  name: string;
  size: number;
  type: string;
  url: string;
}

// Format file size for display
export const formatFileSize = (bytes: number): string => {
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
};

// Generate file URL for storage (MVP implementation)
export const generateFileUrl = (fileName: string): string => {
  return `/uploads/${Date.now()}-${fileName}`;
};

// Convert file to data URL for JSON Forms
export const fileToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to convert file to data URL'));
      }
    };
    reader.onerror = () => reject(new Error('File reading failed'));
    reader.readAsDataURL(file);
  });
};

// Extract file info from File object
export const extractFileInfo = (file: File): FileInfo => {
  return {
    name: file.name,
    size: file.size,
    type: file.type,
    url: generateFileUrl(file.name),
  };
};

// Validate file type
export const isAllowedFileType = (file: File): boolean => {
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];
  return allowedTypes.includes(file.type);
};

// Validate file size
export const isWithinSizeLimit = (file: File, maxSizeMB: number = 5): boolean => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};
