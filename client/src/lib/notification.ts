import { toast } from "@/hooks/use-toast";

export interface NotificationOptions {
  title: string;
  description?: string;
  duration?: number;
}

export const notify = {
  success: (options: NotificationOptions) => {
    return toast({
      title: options.title,
      description: options.description,
      variant: "success",
    });
  },

  error: (options: NotificationOptions) => {
    return toast({
      title: options.title,
      description: options.description,
      variant: "destructive",
    });
  },

  warning: (options: NotificationOptions) => {
    return toast({
      title: options.title,
      description: options.description,
      variant: "warning",
    });
  },

  info: (options: NotificationOptions) => {
    return toast({
      title: options.title,
      description: options.description,
      variant: "info",
    });
  },

  loading: (options: NotificationOptions) => {
    return toast({
      title: options.title,
      description: options.description,
      variant: "default",
    });
  },
};
