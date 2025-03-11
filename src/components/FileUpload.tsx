
import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void;
  maxFiles?: number;
  accept?: string;
  className?: string;
  previewUrls?: string[];
}

const FileUpload = ({ 
  onFilesSelected, 
  maxFiles = 5, 
  accept = "image/*", 
  className,
  previewUrls = [] 
}: FileUploadProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [previews, setPreviews] = useState<string[]>(previewUrls);
  const [files, setFiles] = useState<File[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };
  
  const handleFiles = (fileList: FileList) => {
    const newFiles = Array.from(fileList).slice(0, maxFiles - files.length);
    
    if (newFiles.length > 0) {
      // Create preview URLs
      const newPreviews = newFiles.map(file => URL.createObjectURL(file));
      
      // Update state
      const updatedFiles = [...files, ...newFiles];
      setFiles(updatedFiles);
      setPreviews([...previews, ...newPreviews]);
      
      // Call the parent callback
      onFilesSelected(updatedFiles);
    }
  };
  
  const removeFile = (index: number) => {
    // Release the object URL to avoid memory leaks
    URL.revokeObjectURL(previews[index]);
    
    // Update state
    const newPreviews = [...previews];
    newPreviews.splice(index, 1);
    setPreviews(newPreviews);
    
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
    
    // Call the parent callback
    onFilesSelected(newFiles);
  };
  
  const openFileDialog = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div 
        onDragEnter={handleDrag}
        className={cn(
          "border-2 border-dashed rounded-xl p-6 text-center transition-colors",
          dragActive 
            ? "border-brand-teal bg-brand-teal/5" 
            : "border-gray-300 hover:border-gray-400",
          previews.length >= maxFiles ? "opacity-50 pointer-events-none" : ""
        )}
      >
        {previews.length >= maxFiles ? (
          <div className="flex flex-col items-center justify-center space-y-2 text-gray-500">
            <Check className="h-8 w-8 text-brand-teal" />
            <p className="text-sm font-medium">Maximum number of files reached</p>
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center justify-center space-y-2 text-gray-500">
              <Upload className="h-8 w-8 text-brand-slate/60" />
              <p className="text-sm font-medium">Drag & drop files here, or click to select files</p>
              <p className="text-xs">Maximum {maxFiles} files • {accept.replace("image/*", "Images")}</p>
            </div>
            
            <input
              ref={inputRef}
              type="file"
              multiple
              accept={accept}
              onChange={handleChange}
              className="hidden"
            />
            
            <button
              type="button"
              onClick={openFileDialog}
              className="mt-4 btn-outline py-1.5 px-4 text-sm"
            >
              Select Files
            </button>
            
            {dragActive && (
              <div
                className="absolute inset-0 w-full h-full"
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              />
            )}
          </>
        )}
      </div>
      
      {/* File previews */}
      {previews.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {previews.map((preview, index) => (
            <div key={index} className="relative group aspect-square">
              <img
                src={preview}
                alt={`Preview ${index + 1}`}
                className="w-full h-full object-cover rounded-lg border border-gray-200"
              />
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="absolute top-1 right-1 bg-white/90 backdrop-blur-sm hover:bg-white text-gray-700 hover:text-red-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
