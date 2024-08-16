import React, { useRef, useContext, useState } from 'react';
import PropTypes from 'prop-types';
import LoginContext from '../../login/contexts/LoginContext';
import axiosInstance from '../../login/component/Token/axiosInstance';

const UploadImage = ({ onImageUpload }) => {
  const fileInput = useRef(null);
  const { state } = useContext(LoginContext);
  const { userId } = state;

  const BASE_URL = 'http://localhost:8080';
 
  const handleChange = async (e) => {
    if (e.target.files[0]) {
      const formData = new FormData();
      formData.append('file', e.target.files[0]);
      formData.append('userId', userId);

      try {
        const response = await axiosInstance.post('/update-profile-image', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        
        const { profileImageUrl } = response.data;

        if (profileImageUrl) {
          console.log('Uploaded profile image URL:', profileImageUrl);
          // 서버에서 받은 이미지 URL을 BASE_URL과 합쳐서 반환
          onImageUpload(`${BASE_URL}${profileImageUrl}`);
        } else {
          console.error('Error: No profileImageUrl in response');
        }
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  };
    
      const handleClick = () => {
        fileInput.current.click();
      }; 

  return (
      <>
          <input
              type="file"
              style={{ display: 'none' }}
              accept="image/jpg,image/png,image/jpeg"
              onChange={handleChange}
              ref={fileInput}
          />
          <button className="btn btn-warning upload-button" onClick={handleClick}>이미지 편집</button>
      </>
  );
};

UploadImage.propTypes = {
  onImageUpload: PropTypes.func.isRequired,
};

export default UploadImage;

