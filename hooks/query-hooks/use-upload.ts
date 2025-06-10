import { useMutation } from "@tanstack/react-query"
import { uploadImage, uploadMultImage } from "@/lib/api"
import { toast } from "@/components/ui/use-toast"

export function useUpload() {
  const singleUploadMutation = useMutation({
    mutationFn: uploadImage,
    onSuccess: () => {
      toast({
        title: "Upload Successful",
        description: "Image has been uploaded successfully.",
      })
    },
    onError: (error: any) => {
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload image.",
        variant: "destructive",
      })
    },
  })

  const multipleUploadMutation = useMutation({
    mutationFn: uploadMultImage,
    onSuccess: () => {
      toast({
        title: "Upload Successful",
        description: "Images have been uploaded successfully.",
      })
    },
    onError: (error: any) => {
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload images.",
        variant: "destructive",
      })
    },
  })

  return {
    uploadSingle: (file: File) => singleUploadMutation.mutate(file),
    uploadMultiple: (files: FileList | File[]) => multipleUploadMutation.mutate(files),
    isSingleUploading: singleUploadMutation.isPending,
    isMultipleUploading: multipleUploadMutation.isPending,
    singleUploadData: singleUploadMutation.data,
    multipleUploadData: multipleUploadMutation.data,
  }
}
