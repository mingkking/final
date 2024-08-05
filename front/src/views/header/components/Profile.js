import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import {
  Avatar,
  Box,
  Menu,
  Button,
  IconButton,
  MenuItem,
  ListItemIcon, 
  ListItemText
} from '@mui/material';

import { IconEdit, IconLeaf, IconListCheck, IconUser } from '@tabler/icons-react';

import LoginContext from '../../login/contexts/LoginContext';
import axiosInstance from '../../login/component/Token/axiosInstance';
import Cookies from 'js-cookie';




const Profile = ({ onLogout }) => {
  const [anchorEl2, setAnchorEl2] = useState(null);
  const { state, actions } = useContext(LoginContext);
  

  useEffect(() => { 
    
    // 로그인 상태를 확인할 때 프로필 사진 URL을 가져옵니다.
    if (state.userId && !state.profileImage) {
      axiosInstance.get(`/profile-image/${state.userId}`)
        .then(response => {
          console.log('Profile image response:', response.data);
          const data = response.data;
          if (data.profileImageUrl) {
            const profileImageUrl = `http://localhost:8080${data.profileImageUrl}`;
            actions.setProfileImage(profileImageUrl);
          }
        })
        .catch(error => console.error('Error fetching profile image:', error));
    }
    console.log('Profile image URL from context:', state.profileImage);
  }, [state.userId, state.profileImage, actions]);

  const handleClick2 = (event) => {
    setAnchorEl2(event.currentTarget);
  };
  const handleClose2 = () => {
    setAnchorEl2(null);
  };

  

  

  return (
    <Box>
      <IconButton
        size="large"
        aria-label="show 11 new notifications"
        color="inherit"
        aria-controls="msgs-menu"
        aria-haspopup="true"
        sx={{
          ...(typeof anchorEl2 === 'object' && {
            color: 'primary.main',
          }),
        }}
        onClick={handleClick2}
      >
         <Avatar
          src={state.profileImage} 
          alt="Profile"
          sx={{
            width: 35,
            height: 35,            
          }}
          
          
        />
      </IconButton>
      
      {/* ------------------------------------------- */}
      {/* Message Dropdown */}
      {/* ------------------------------------------- */}
      <Menu
        id="msgs-menu"
        anchorEl={anchorEl2}
        keepMounted
        open={Boolean(anchorEl2)}
        onClose={handleClose2}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        sx={{
          '& .MuiMenu-paper': {
            width: '200px',
          },
        }}
      >
        <MenuItem component={Link} to="/MyPage" onClick={handleClose2}>
          <ListItemIcon>
            <IconUser width={20} />
          </ListItemIcon>
          <ListItemText>마이페이지</ListItemText>
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <IconListCheck width={20} />
          </ListItemIcon>
          <ListItemText>프로필수정</ListItemText>
        </MenuItem>
        <MenuItem component={Link} to="/PwFind" onClick={handleClose2}>
          <ListItemIcon>
            <IconEdit width={20} />
          </ListItemIcon>
          <ListItemText>비밀번호변경</ListItemText>
        </MenuItem>
        
        <MenuItem component={Link} to="/DeleteMember" onClick={handleClose2}>
          <ListItemIcon>
            <IconLeaf width={20} />
          </ListItemIcon>
          <ListItemText>회원탈퇴</ListItemText>
        </MenuItem>
        <Box mt={1} py={1} px={2}>
          <Button onClick={onLogout} variant="outlined" color="primary" fullWidth>
            Logout
          </Button>
        </Box>
      </Menu>
      
    </Box>
  );
};

export default Profile;
