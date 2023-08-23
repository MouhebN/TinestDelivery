import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from "axios";
import MiniDrawerChefAgence from "../../Layouts/sideBarChefAgence";
import {FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import {SnackbarProvider, useSnackbar} from "notistack";


const defaultTheme = createTheme();

const roles = ['livreur', 'magasinier','fournisseur'];

export default function SignUp() {
    const [selectedRole, setSelectedRole] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [nom, setNom] = useState('');
    const [prenom, setPrenom] = useState('');
    const [email, setEmail] = useState('');
    const [telephone, setTelephone] = useState('');
    const [matriculeVoiture, setMatriculeVoiture] = useState('');
    const [address, setAddress] = useState('');
    const [isEmailValid, setIsEmailValid] = useState(true);

    const handleChange = (event) => {
        setSelectedRole(event.target.value);
    };
    const handleEmailChange = (event) => {
        const newEmail = event.target.value;
        setEmail(newEmail);

        // Perform email format validation
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        setIsEmailValid(emailRegex.test(newEmail));
    };
    const {enqueueSnackbar}  = useSnackbar();

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!isEmailValid) {
            enqueueSnackbar('Incorrect email format  ', {variant: 'error'});
        }

        try {
            const response = await axios.post('http://localhost:3000/register', {
                    role: selectedRole,
                    username,
                    password,
                    nom,
                    prenom,
                    email,
                    telephone,
                    matricule_voiture: matriculeVoiture,
                    address
                }, {
                    headers: {
                        "x-access-token": localStorage.getItem('token')
                    }
                }
            );

            if (response.status === 200) {
                const data = response.data;
                enqueueSnackbar('Account added succesfully', {variant: 'success'});
            }
        } catch (error) {
            console.error('Error during registration:', error);

            if (error.response && error.response.data && error.response.data.error) {
                const errorMessage = error.response.data.error;
                enqueueSnackbar(errorMessage, {variant: 'error'});
            } else {
                enqueueSnackbar('Error during registration', {variant: 'error'});
            }
        }
    };

    return (
        <>
        <MiniDrawerChefAgence/>
        <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Register
                    </Typography>
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <FormControl fullWidth sx={{boxShadow:2}}>
                                    <InputLabel id="role-label">Role</InputLabel>
                                    <Select
                                        labelId="role-label"
                                        id="role"
                                        value={selectedRole}
                                        label="Role"
                                        onChange={handleChange}
                                    >
                                        {roles.map((option) => (
                                            <MenuItem key={option} value={option}>
                                                {option}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    id="username"
                                    label="Username"
                                    name="username"
                                    value={username}
                                    onChange={(event) => setUsername(event.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    id="password"
                                    label="Password"
                                    name="password"
                                    type="password"
                                    value={password}
                                    onChange={(event) => setPassword(event.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    id="nom"
                                    label="Nom"
                                    name="nom"
                                    value={nom}
                                    onChange={(event) => setNom(event.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    id="prenom"
                                    label="Prénom"
                                    name="prenom"
                                    value={prenom}
                                    onChange={(event) => setPrenom(event.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    type="email"
                                    value={email}
                                    onChange={handleEmailChange}
                                    error={!isEmailValid}
                                    helperText={!isEmailValid ? 'Invalid email format' : ''}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="telephone"
                                    label="Telephone"
                                    name="telephone"
                                    value={telephone}
                                    onChange={(event) => setTelephone(event.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    id="matriculeVoiture"
                                    label="Matricule Voiture"
                                    name="matriculeVoiture"
                                    value={matriculeVoiture}
                                    onChange={(event) => setMatriculeVoiture(event.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="address"
                                    label="Address"
                                    name="address"
                                    value={address}
                                    onChange={(event) => setAddress(event.target.value)}
                                />
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign Up
                        </Button>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
        </>
    );
}

