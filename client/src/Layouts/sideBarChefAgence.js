import * as React from 'react';
import {styled, useTheme} from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import {Link} from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import LogoutIcon from "@mui/icons-material/Logout";
import WelcomeComponent from "../Components/welcome";
import {AiFillFileAdd, AiOutlineUsergroupAdd} from "react-icons/ai";
import {BsClipboard2DataFill} from "react-icons/bs";
import {FcAcceptDatabase, FcDebt} from "react-icons/fc";
import {IoMdAddCircle} from "react-icons/io";
import {TbTruckReturn} from "react-icons/tb";


const drawerWidth = 240;

const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme) => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const DrawerHeader = styled('div')(({theme}) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({theme, open}) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const Drawer = styled(MuiDrawer, {shouldForwardProp: (prop) => prop !== 'open'})(
    ({theme, open}) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
        }),
    }),
);

export default function MiniDrawerChefAgence() {
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const handleLogout = () => {
        // Clear the token from localStorage
        localStorage.removeItem('token');
        window.location.href = '/login';
    };

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    return (
        <Box sx={{display: 'flex'}}>
            <CssBaseline/>
            <AppBar position="fixed" open={open} sx={{backgroundColor: '#D6E8DB', color: '#0C134F', opacity: 0.8}}>
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        sx={{
                            marginRight: 5,
                            ...(open && {display: 'none'}),
                        }}
                    >
                        <MenuIcon/>
                    </IconButton>
                    <Typography variant="h6" noWrap component="div">
                        Tinest Delivery
                    </Typography>
                    <Avatar src="/logo.png" sx={{width: 70, height: 70, left: 380}}/>
                    <div style={{display: 'flex', alignItems: 'center', marginLeft: '750px'}}>
                        <WelcomeComponent/>
                        <Avatar src="/broken-image.jpg" sx={{width: 40, height: 40, marginLeft: '10px'}}/>
                    </div>
                </Toolbar>
            </AppBar>
            <Drawer variant="permanent" open={open}>
                <DrawerHeader sx={{backgroundColor: '#D6E8DB', color: '#0C134F'}}>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'rtl' ? <ChevronRightIcon/> : <ChevronLeftIcon/>}
                    </IconButton>
                </DrawerHeader>
                <Divider/>
                <List>
                    {['Livreur Debt', 'consulter Colis', 'Data', 'Ajouter Compte'].map((text, index) => (
                        <ListItem key={text} disablePadding sx={{display: 'block'}}>
                            <ListItemButton component={Link} to={
                                text === '' +
                                'Livreur Debt '
                                    ? '/getLivreurLivredColis'
                                    : text === 'consulter Colis'
                                        ? '/getColisEnAttente'
                                        : text === 'Data'
                                            ? '/getData'
                                            : text === 'Ajouter Compte'
                                                ? '/signUp'

                                                : '/getLivreurLivredColis'
                            }
                                            sx={{
                                                minHeight: 48,
                                                justifyContent: open ? 'initial' : 'center',
                                                px: 2.5,
                                            }}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        mr: open ? 3 : 'auto',
                                        justifyContent: 'center',
                                        fontSize: '24px',
                                    }}
                                >
                                    {index % 4 === 0 ? <FcDebt/> : index % 3 === 0 ?
                                        <AiOutlineUsergroupAdd/> : index % 2 === 0 ? <BsClipboard2DataFill/> : <FcAcceptDatabase/>}


                                </ListItemIcon>
                                <ListItemText primary={text} sx={{opacity: open ? 1 : 0}}/>
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
                <Divider/>
                <List>
                    <ListItem disablePadding sx={{ display: 'block' }}>
                        <List>
                            {['ajouter au stock', 'scan retour', 'Atrribuer Colis', 'Ajouter Facture'].map((text, index) => (
                                <ListItem key={text} disablePadding sx={{ display: 'block' }}>
                                    <ListItemButton
                                        component={Link}
                                        to={
                                            text === 'ajouter au stock' ? '/ajouterColisAuStock' :
                                                text === 'Atrribuer Colis' ? '/attribuerColis' :
                                                    text === 'scan retour' ? '/retournerColis' :
                                                        ''
                                        }
                                        sx={{
                                            minHeight: 48,
                                            justifyContent: open ? 'initial' : 'center',
                                            px: 2.5,
                                        }}
                                    >
                                        <ListItemIcon
                                            sx={{
                                                minWidth: 0,
                                                mr: open ? 3 : 'auto',
                                                justifyContent: 'center',
                                                fontSize: '24px',
                                            }}
                                        >
                                            {index % 4 === 0 ? <IoMdAddCircle /> :
                                                index % 3 === 0 ? <AiFillFileAdd /> :
                                                    index % 2 === 0 ? <BsClipboard2DataFill /> :
                                                        <TbTruckReturn />}
                                        </ListItemIcon>
                                        <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                </List>


                <ListItemButton
                            sx={{
                                minHeight: 48,
                                justifyContent: open ? 'initial' : 'center',
                                px: 2.5,
                            }}
                            onClick={handleLogout}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: open ? 3 : 'auto',
                                    justifyContent: 'center',
                                    fontSize: '24px',
                                }}
                            >
                                <LogoutIcon/>
                            </ListItemIcon>
                            <ListItemText primary="Logout" sx={{opacity: open ? 1 : 0}}/>
                        </ListItemButton>
                    </ListItem>
                </List>
            </Drawer>
            <Box component="main" sx={{flexGrow: 1, p: 3}}>
                <DrawerHeader/>
            </Box>
        </Box>
    );
}