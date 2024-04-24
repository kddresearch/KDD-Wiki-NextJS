"use client";

import * as React from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import { Alt, ArrowUpRight, ArrowUpRightSquare, Gear, PersonAdd } from 'react-bootstrap-icons';
import { QueryClient, QueryClientProvider } from "react-query";
// import PersonAdd from '@mui/icons-material/PersonAdd';
// import Settings from '@mui/icons-material/Settings';
// import Logout from '@mui/icons-material/Logout';

// import { signOut } from "@/auth";

import { redirect } from 'next/navigation'
import WikiUser from '@/app/lib/models/wikiuser';

export default function AccountMenu(
  {user} : 
  {user: any}
) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  try {
    user = new WikiUser(user);
  } catch (error) {
    user = WikiUser.guestFactory();
  }

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleRedirect = (path: string) => {
    handleClose()
    redirect(path)
  }

  return (
    <React.Fragment>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
        <Tooltip title="Manage Account">
          <button onClick={handleClick} className='text-xs h-4'>Welcome <span className='font-semibold'>{user.username}</span></button>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleClose}>
          <Avatar className='mr-2' /> View Profile
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <Alt fontSize="small" />
          </ListItemIcon>
          Admin Dashboard
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <Gear fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <ArrowUpRight fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
}
