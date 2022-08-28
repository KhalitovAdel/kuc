import React from 'react';
import { TableContainer, Table as MuiTable, Paper, TableHead, TableBody, TableCell, TableRow } from '@mui/material';
import { Cell } from '../interface';

export interface MinimalElement {
    id: string | number;
}

export interface TableProps<T extends MinimalElement> {
    cells: Cell<T>[];
    values: T[];
}

export function Table<T extends MinimalElement>({ cells, values }: TableProps<T>) {
    return <TableContainer component={Paper}>
        <MuiTable>
            <TableHead>
                <TableRow>
                    {cells.map((c, i) => <TableCell key={`${i}`}>{c.title}</TableCell>)}
                </TableRow>
            </TableHead>
            <TableBody>
                {values.map(v => (<TableRow key={v.id}>
                    {cells.map((c, i) => <TableCell key={`${i}`}>{c.render(v)}</TableCell>)}
                </TableRow>))}
            </TableBody>
        </MuiTable>
    </TableContainer>
}