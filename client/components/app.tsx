import { Container } from '@mui/material';
import React from 'react';

export function App<T extends object>(Component: (props: T) => JSX.Element): React.FC<T>  {
    return (props: T) => {
        return <Container maxWidth="lg">
            <p>Hello from Client</p>
            <Component {...props}/>
            <p>FOOTER</p>
        </Container>
    }
};