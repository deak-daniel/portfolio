import { useState } from "react";

export default function useSnackBar() {
    const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);

    function showSnackBar(message: string | null, duration: number = 3000) {
        setSnackbarMessage(message);
        setTimeout(() => {
            setSnackbarMessage(null);
        }, duration);
    }

    return { snackbarMessage, showSnackBar };
}