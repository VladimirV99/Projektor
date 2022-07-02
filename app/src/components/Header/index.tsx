import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { Fragment, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectIsUserLoggedIn, selectUser } from 'redux/auth/selectors';
import { ButtonGroup, Button as BootstrapButton } from 'react-bootstrap';
import SignUp from 'features/authentication/SignUp';
import SignIn from 'features/authentication/SignIn';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { logoutCustomer } from 'redux/auth/modules';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';
import { isUserAdmin, isUserCustomer } from 'util/auth';
import {
    selectShowSignUpForm,
    selectShowSignInForm,
} from 'redux/auth/selectors';
import { openSignUpForm, openSignInForm } from 'redux/auth/actions';

const Header = () => {
    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
        null
    );
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
        null
    );

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const pages: { name: string; link: string }[] = useMemo(() => {
        return [
            { name: 'Home', link: '/' },
            { name: 'Browse Movies', link: '/movies' },
            { name: 'Screenings Calendar', link: '/screenings_calendar' },
            { name: 'Contact Us', link: '/contact_us' },
        ];
    }, []);

    const isLoggedIn = useSelector(selectIsUserLoggedIn);

    const signInModal = useSelector(selectShowSignInForm);
    const signUpModal = useSelector(selectShowSignUpForm);

    const isUserLoggedIn = useSelector(selectIsUserLoggedIn);

    useEffect(() => {
        if (isUserLoggedIn) {
            dispatch(openSignInForm(false));
            dispatch(openSignUpForm(false));
        }
    }, [isUserLoggedIn]);

    const onSignUpLinkClicked = () => {
        dispatch(openSignUpForm(true));
    };

    const onSignInLinkClicked = () => {
        dispatch(openSignInForm(true));
    };

    const user = useSelector(selectUser);
    const initials = user ? user.firstName[0] + user.lastName[0] : 'AA';

    const isAdmin = useMemo(
        () => isLoggedIn && isUserAdmin(),
        [isLoggedIn, user]
    );
    const isCustomer = useMemo(
        () => isLoggedIn && isUserCustomer(),
        [isLoggedIn, user]
    );

    const settings: { name: string; link?: string; onClick?: () => void }[] =
        useMemo(() => {
            const adminLinks = isAdmin
                ? [{ name: 'Admin Dashboard', link: '/admin' }]
                : [];

            const customerLinks = isCustomer
                ? [{ name: 'My Reservations', link: '/reservations' }]
                : [];

            return [
                ...adminLinks,
                ...customerLinks,
                { name: 'Profile Settings', link: '/profile_settings' },
                {
                    name: 'Logout',
                    onClick: () => {
                        dispatch(logoutCustomer());
                    },
                },
            ];
        }, [isAdmin, isCustomer]);

    const renderMenu = () => (
        <Fragment>
            <LogoIconWrapper>
                <FontAwesomeIcon icon={faCamera} />
            </LogoIconWrapper>

            <Typography
                variant="h6"
                noWrap
                component="a"
                href="/"
                sx={{
                    mr: 2,
                    display: { xs: 'none', md: 'flex' },
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    letterSpacing: '.3rem',
                    color: 'inherit',
                    textDecoration: 'none',
                }}
            >
                PROJEKTOR
            </Typography>

            <Box
                sx={{
                    flexGrow: 1,
                    display: { xs: 'flex', md: 'none' },
                }}
            >
                <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleOpenNavMenu}
                    color="inherit"
                >
                    <MenuIcon />
                </IconButton>
                <Menu
                    id="menu-appbar"
                    anchorEl={anchorElNav}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    keepMounted
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                    open={Boolean(anchorElNav)}
                    onClose={handleCloseNavMenu}
                    sx={{
                        display: { xs: 'block', md: 'none' },
                    }}
                >
                    {pages.map(({ name, link }) => (
                        <MenuItem
                            key={name}
                            onClick={() => {
                                handleCloseNavMenu();
                                navigate(link);
                            }}
                        >
                            <Typography textAlign="center">{name}</Typography>
                        </MenuItem>
                    ))}
                </Menu>
            </Box>
        </Fragment>
    );

    const renderLogoAndName = () => (
        <Fragment>
            <Typography
                variant="h5"
                noWrap
                component="a"
                href=""
                sx={{
                    mr: 2,
                    display: { xs: 'flex', md: 'none' },
                    flexGrow: 1,
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    letterSpacing: '.3rem',
                    color: 'inherit',
                    textDecoration: 'none',
                }}
            >
                PROJEKTOR
            </Typography>
        </Fragment>
    );

    const renderPages = () => (
        <Box
            sx={{
                flexGrow: 1,
                display: { xs: 'none', md: 'flex' },
            }}
        >
            {pages.map(({ name, link }) => (
                <Button
                    key={name}
                    onClick={() => {
                        handleCloseNavMenu();
                        navigate(link);
                    }}
                    sx={{ my: 2, color: 'white', display: 'block' }}
                >
                    {name}
                </Button>
            ))}
        </Box>
    );
    const renderLoggedUserMenu = () => (
        <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar>{initials}</Avatar>
                </IconButton>
            </Tooltip>
            <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
            >
                {settings.map(({ name, link, onClick }) => (
                    <MenuItem
                        key={name}
                        onClick={() => {
                            handleCloseUserMenu();
                            if (onClick) {
                                onClick();
                            }
                            if (link) {
                                navigate(link);
                            }
                        }}
                    >
                        <Typography textAlign="center">{name}</Typography>
                    </MenuItem>
                ))}
            </Menu>
        </Box>
    );

    const renderUserMenu = () =>
        isLoggedIn ? (
            renderLoggedUserMenu()
        ) : (
            <Fragment>
                <BootstrapButton
                    variant="light"
                    onClick={onSignUpLinkClicked}
                    style={{ marginRight: '5px' }}
                >
                    Sign Up
                </BootstrapButton>

                <BootstrapButton
                    variant="light"
                    onClick={onSignInLinkClicked}
                    style={{ marginLeft: '5px' }}
                >
                    Sign In
                </BootstrapButton>
            </Fragment>
        );

    const renderModals = () => (
        <Fragment>
            {signUpModal && (
                <SignUp onModalClose={() => dispatch(openSignUpForm(false))} />
            )}
            {signInModal && (
                <SignIn onModalClose={() => dispatch(openSignInForm(false))} />
            )}
        </Fragment>
    );
    return (
        <Fragment>
            {renderModals()}
            <AppBar position="static">
                <Container maxWidth="xl">
                    <Toolbar disableGutters>
                        {renderMenu()}
                        {renderLogoAndName()}
                        {renderPages()}
                        {renderUserMenu()}
                    </Toolbar>
                </Container>
            </AppBar>
        </Fragment>
    );
};

export default Header;

const LogoIconWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    padding-right: 10px;
`;
