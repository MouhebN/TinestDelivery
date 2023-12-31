import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import {useState} from 'react';
import {SnackbarProvider, useSnackbar} from "notistack";
import ErrorSound from '../../Utils/ErrorSound';
import axios from 'axios';

function Copyright(props) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="https://mui.com/">
                Your Website
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const defaultTheme = createTheme();
export default function SignInSide({setUserRoleFromToken}) {
    const {enqueueSnackbar} = useSnackbar();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorOccurred, setErrorOccurred] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/login', {
                username,
                password,
            });
            if (response.status === 200) {
                const data = response.data;
                // Assuming data.token and data.role are present in the response
                localStorage.setItem('token', data.token);
                console.log("data.token", data.token);
                if (data.role === 'magasinier') {
                    window.location.href = '/ajouterColisAuStock';
                } else if (data.role === 'livreur') {
                    window.location.href = '/payementColis';
                } else if (data.role === 'chefAgence') {
                    window.location.href = '/getData';
                } else if (data.role === 'fournisseur') {
                    window.location.href = '/Accueil';
                } else {
                    console.error('Error during login:');
                    enqueueSnackbar(response.data.error, {variant: 'error'});
                    setErrorOccurred(true);

                }
            }
        }catch (error)
            {
                if (error.response && error.response.data && error.response.data.error) {
                    // Display the backend error message in the Snackbar
                    enqueueSnackbar(error.response.data.error, {variant: 'error'});
                    setErrorOccurred(true);

                } else {
                    enqueueSnackbar('Erreur login ', {variant: 'error'});
                    setErrorOccurred(true);
                }
            }
        };
        return (
            <ThemeProvider theme={defaultTheme}>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        minHeight: '100vh',
                        backgroundImage: 'url(https://source.unsplash.com/random?wallpapers)',
                        backgroundRepeat: 'no-repeat',
                        backgroundColor: (t) =>
                            t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                        backgroundSize: 'cover',
                    }}
                >
                    <CssBaseline/>
                    <Grid
                        item
                        xs={12}
                        sm={8}
                        md={5}
                        component={Paper}
                        elevation={6}
                        square
                        sx={{
                            backgroundColor: 'rgba(255, 255, 255, 0.6)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            p: 4,
                        }}
                    >
                        <Avatar sx={{m: 1, bgcolor: 'secondary.main'}}>
                            <LockOutlinedIcon/>
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Sign in
                        </Typography>

                        <Box
                            component="form"
                            noValidate
                            onSubmit={handleSubmit}
                            sx={{mt: 1, backgroundColor: 'transparent'}}
                        >
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="username"
                                label="Username"
                                name="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <FormControlLabel
                                control={<Checkbox value="remember" color="primary"/>}
                                label="Remember me"
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{mt: 3, mb: 2}}
                            >
                                Sign In
                            </Button>
                            <Copyright sx={{mt: 5}}/>
                        </Box>
                    </Grid>
                </Box>
                {errorOccurred && <ErrorSound playSound/>}
            </ThemeProvider>
        );
    }

