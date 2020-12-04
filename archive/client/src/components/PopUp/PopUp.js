import React, { useState, useEffect } from 'react';
import Snackbar from '@material-ui/core/Snackbar';

export default function PopUp(props) {
    const [state, setState] = useState({
        open: props.open || false,
        vertical: 'bottom',
        horizontal: 'right',
        message: props.message || '',
    });

    const { vertical, horizontal, open, message } = state

    useEffect(() => {
        setState((state) => ({ ...state, message: props.message, open: !!props.message }))
    }, [props])


    const handleClose = () => {
        props.clearMessage()
        setState({ ...state, open: false, message: '' });
    };

    return (
        <div>
            <Snackbar
                open={open}
                autoHideDuration={2500}
                anchorOrigin={{ vertical, horizontal }}
                onClose={handleClose}
                message={message}
                key={vertical + horizontal}
            />
        </div>
    );
}
