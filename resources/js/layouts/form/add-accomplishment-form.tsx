import { Form } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import InputError from "@/components/input-error";

import { CirclePlusIcon } from "lucide-react";
import { 
    DialogFooter,
    DialogClose
} from "@/components/ui/dialog"
import { useRef, useState } from "react";
import DialogLayout from "../dialog-layout";
import Heading from "@/components/heading";
import { DatePickerWithRange } from "@/components/ui/date-picker";
import { DateRange } from "react-day-picker";
import AccomplishmentController from "@/actions/App/Http/Controllers/AccomplishmentController";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function AccomplishmentForm() { 

    const [dateRange, setDateRange] = useState<DateRange | undefined>();
    
    function getDatesBetween(from: Date, to: Date) {
        
        const dates = [];
        const current = new Date(from);

        while (current <= to) {
            dates.push(new Date(current));
            current.setDate(current.getDate() + 1);
        }        

        return dates;
    }

    const dates =
        dateRange?.from && dateRange?.to
            ? getDatesBetween(dateRange.from, dateRange.to)
            : [];

    console.log(dates);
    

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
                            {...AccomplishmentController.store.form()}
                            onSuccess={() => close()}

                        >
                            {({ resetAndClearErrors, processing, errors }) => {
                                resetRef.current = resetAndClearErrors;
                                return (
                                    <>
                                        <div className="flex flex-col gap-4">
                                            <div className="flex flex-col gap-4">
                                                <DatePickerWithRange 
                                                    title=""
                                                    date={dateRange}
                                                    onChange={setDateRange}
                                                />
                                                <InputError message={errors.date} />
                                            </div>
                                            {dates.map((date, index) => {
                                                const formatted = date.toLocaleDateString();

                                                return (
                                                    <div key={index} className="flex flex-row items-center gap-2">
                                                        <Label 
                                                            htmlFor={`accomplishments[${formatted}]`}
                                                            className="text-sm font-medium">
                                                            {formatted}
                                                        </Label>

                                                        <Textarea
                                                            name={`accomplishments[${formatted}]`}
                                                            className="w-full border rounded px-3 py-2 whitespace-normal break-words resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                                                            placeholder="Enter accomplishment"
                                                        />
                                                    </div>
                                                );
                                            })}
                                            <DialogFooter className="gap-2">
                                                <DialogClose asChild>
                                                    <Button type="button" variant="outline">
                                                        Cancel
                                                    </Button>
                                                </DialogClose>
                                                <Button type="submit" disabled={processing}>
                                                    Create Accomplishment
                                                </Button>
                                            </DialogFooter>
                                        </div>
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