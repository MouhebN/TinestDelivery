import { createTheme } from '@mui/material/styles';

// Define colors for light and dark mode
export const lightTheme = createTheme({
    palette: {
        background: {
            default: '#F9F9F9', // Replace with your desired default background color
            paper: '#ffffff',   // Replace with your desired paper background color
        },
    }
});

export const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        // Define dark mode colors
    },
});
