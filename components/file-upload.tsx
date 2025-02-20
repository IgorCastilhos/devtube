"use client";

import {toast} from "@/components/ui/use-toast";

import {UploadDropzone} from "@/lib/uploadthing";
import {ourFileRouter} from "@/app/api/uploadthing/core";

interface FileUploadProps {
    onChange: (url?: string, originalFilename?: string) => void;
    endpoint: keyof typeof ourFileRouter;
}

export const FileUpload = ({
                               onChange,
                               endpoint
                           }: FileUploadProps) => {

    return (
        <UploadDropzone
            endpoint={endpoint}
            onClientUploadComplete={(res) => {
                console.log("onClientUploadComplete res:", res);
                onChange(res?.[0].url, res?.[0].name);
            }}
            onUploadError={(error: Error) => {
                toast({
                    variant: "destructive",
                    description: error?.message
                })
            }}
        />
    )
}
