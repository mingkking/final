import React, { useRef, useContext } from 'react';
import PropTypes from 'prop-types';
import LoginContext from '../../login/contexts/LoginContext';
import axiosInstance from '../../login/component/Token/axiosInstance';

const UploadImage = ({ onImageUpload }) => {
  const fileInput = useRef(null);
  const { state } = useContext(LoginContext);
  const { userId } = state;

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
            if (response.data.profileImageUrl) {
              onImageUpload(response.data.profileImageUrl); // 업로드 후 이미지 URL 반환
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
          <button onClick={handleClick}>편집</button>
      </>
  );
};

UploadImage.propTypes = {
  onImageUpload: PropTypes.func.isRequired,
};

export default UploadImage;