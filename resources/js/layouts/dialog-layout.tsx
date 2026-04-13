import { useRef, useState } from "react";
import type { DialogProps } from "@/types";

import { 
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogDescription,
    DialogTitle
} from "@/components/ui/dialog"

export default function DialogLayout({
    trigger,
    title,
    description,
    children,
}: DialogProps) { 
    const resetFormRef = useRef<(() => void) | null>(null);
    
    function handleDialogOpenChange(open: boolean): void {
        if (!open) {
            resetFormRef.current?.();
        }
        setDialogOpen(open);
    }
        
    const [dialogOpen, setDialogOpen] = useState(false);
    return (
        <>
            <div>
                <Dialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
                    <DialogTrigger asChild>
                        {trigger}
                    </DialogTrigger>
                    <DialogContent className='sm:max-w-xl w-full'>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <DialogTitle>{title}</DialogTitle>
                                {description && (
                                    <DialogDescription>
                                        {description}
                                    </DialogDescription>
                                )}
                            </div>
                            {
                                children({
                                    close: () => setDialogOpen(false),
                                    resetRef: resetFormRef,
                                })
                            }
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </>
    )
}