import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { SmartPaginationProps } from '@/types';


export default function SmartPagination({currentPage, lastPage, onPageChange}: SmartPaginationProps) {
    const getPaginationRange = (current: number, last: number, delta = 1) => {
        const range: (number | string)[] = [];
        const left = current - delta;
        const right = current + delta;

        for (let i = 1; i <= last; i++) {
            if ( i === 1 || i === last || (i >= left && i <= right)) 
            {
                range.push(i);
            } else if ( i === left - 1 || i === right + 1) 
            {
                range.push("...");
            }
        }
        
        return range;
    };

    const pages = getPaginationRange(currentPage, lastPage);
    
    return(
        <Pagination>
            <PaginationContent>
                <PaginationItem className='cursor-pointer'>
                    <PaginationPrevious onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}/>
                </PaginationItem>
                {pages.map((page, index) => (
                    <PaginationItem key={index}>
                        {page === "..." ? (
                        <PaginationEllipsis />
                        ) : (
                        <PaginationLink
                            className='cursor-pointer'
                            isActive={page === currentPage}
                            onClick={() => onPageChange(Number(page))}
                        >
                            {page}
                        </PaginationLink>
                        )}
                    </PaginationItem>
                ))}
                <PaginationItem className='cursor-pointer'>
                    <PaginationNext  onClick={() => currentPage < lastPage && onPageChange(currentPage + 1)} />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    )
}