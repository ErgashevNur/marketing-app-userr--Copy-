"use client";
import { toast as sonnerToast } from "sonner";

type ToastProps = {
  title: string;
  description?: string;
  variant?: "default" | "destructive" | "success" | "warning";
};

function toast({ title, description, variant = "default" }: ToastProps) {
  sonnerToast[variant === "destructive" ? "error" : variant === "success" ? "success" : "message"](
    title,
    { description }
  );
}

function useToast() {
  return { toast };
}

export { useToast, toast };
