import React from 'react';
import { Pagination as MuiPagination, PaginationItem } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';

export interface PaginationProps {
    count: number;
    current: number;
    pageCount: number;
}

export function Pagination({pageCount, count, current}: PaginationProps) {
    const location = useLocation()
    return <MuiPagination 
        count={Math.ceil(count/pageCount)} 
        page={current === 0 ? 1 : (Math.ceil(current/pageCount) + 1)} 
        size="small" 
        renderItem={(item) => (<PaginationItem
            component={Link}
            to={`${location.pathname}?skip=${((item.page || 1) - 1) * pageCount}`}
            {...item}
        />)}
    />
};