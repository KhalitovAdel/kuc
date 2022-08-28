import React from 'react';
import { App } from '../../components/app';
import { MinimalElement, Pagination, PaginationProps, Table, TableProps } from '../../components';
import { Button } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';

type Props<T extends MinimalElement> = PaginationProps & Omit<TableProps<T>, 'cells'>;

export function ListPageHok<T extends MinimalElement>(originalProps: Pick<TableProps<T>, 'cells'>) {
    return App((props: Props<T>) => {
        const { pathname } = useLocation();

        return <>
            <Table
                values={props.values}
                cells={originalProps.cells}
            />
            <Pagination {...props} />
            <Link to={`${pathname}?create=true`}><Button>Создать</Button></Link>
        </>
    })
}