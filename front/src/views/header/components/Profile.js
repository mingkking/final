import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useRef, useContext, useEffect } from 'react';
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

import { IconEdit, IconExchange, IconLeaf, IconListCheck, IconLogout, IconMail, IconUser } from '@tabler/icons-react';

import LoginContext from '../../login/contexts/LoginContext';

const Profile = ({ onLogout }) => {
  const [anchorEl2, setAnchorEl2] = useState(null);
  // const [Image, setImage] = useState("https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png")
  const fileInput = useRef(null);
  const { state, actions } = useContext(LoginContext);

  useEffect(() => {
    // 로그인 상태를 확인할 때 프로필 사진 URL을 가져옵니다.
    fetch(`/api/profile-image/${state.userId}`)
        .then(response => response.json())
        .then(data => {
            if (data.profileImageUrl) {
                actions.setProfileImage(data.profileImageUrl);
            }
        })
        .catch(error => console.error('Error fetching profile image:', error));
}, [state.userId]);

  const handleClick2 = (event) => {
    setAnchorEl2(event.currentTarget);
  };
  const handleClose2 = () => {
    setAnchorEl2(null);
  };

  

  const onChange = (e) => {
    if (e.target.files[0]) {
        const reader = new FileReader();
        reader.onload = () => {
            if (reader.readyState === 2) {
                // 서버에 프로필 사진 URL을 업데이트
                fetch('/api/update-profile-image', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userId: state.userId,
                        profileImageUrl: reader.result
                    }),
                }).then(response => response.json())
                  .then(data => {
                      console.log('Profile image updated successfully', data);
                      // 프로필 사진 업데이트 후 클라이언트 상태를 업데이트
                      actions.setProfileImage(reader.result);
                  })
                  .catch(error => console.error('Error updating profile image:', error));
            }
        };
        reader.readAsDataURL(e.target.files[0]);
    }
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
      <input
        type="file"
        style={{ display: 'none' }}
        accept="image/jpg,image/png,image/jpeg"
        onChange={onChange}
        ref={fileInput}
      />
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
        
        <MenuItem>
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
