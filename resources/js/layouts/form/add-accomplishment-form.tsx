import { Form } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import InputError from "@/components/input-error";

import { CirclePlusIcon } from "lucide-react";
import { 
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogDescription,
    DialogTitle
} from "@/components/ui/dialog"
import { useRef, useState } from "react";
import DialogLayout from "../dialog-layout";

export function AccomplishmentForm() { 

    return (
        <>
            <DialogLayout
                trigger={
                    <Button className=''>
                        <CirclePlusIcon className='size-5' />
                        Accomplishment
                    </Button>
                }
                title="Create Accomplishment"
                description="Add a new accomplishment to the system. Fill in the details below."
            >
                {
                    ({ close, resetRef }) => (
                        <Form
                            onSuccess={() => close()}
                        >
                            {({ resetAndClearErrors, processing, errors }) => {
                                resetRef.current = resetAndClearErrors;
                                return (
                                    <>
                                        
                                    </>
                                )
                            }}
                        </Form>
                    )
                }
            </DialogLayout>
            
        </>
    )
}