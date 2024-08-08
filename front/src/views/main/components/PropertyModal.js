import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';

function PropertyModal({ open, handleClose, property }) {
    const navigate = useNavigate(); // useNavigate 훅을 사용하여 네비게이션 기능 추가

    const handleMoreInfo = () => {
        navigate('/budongsan'); // "/budongsan" 페이지로 이동
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>{property.apartMentName}</DialogTitle>
            <DialogContent>
                <DialogContentText>주소: {property.address}</DialogContentText>
                <DialogContentText>층수: {property.floorNumber}</DialogContentText>
                <DialogContentText>거래 금액: {property.transactionAmount}</DialogContentText>
                <DialogContentText>건축 연도: {property.yearBuilt}</DialogContentText>
                <DialogContentText>등록 날짜: {property.registrationDate}</DialogContentText>
                <DialogContentText>면적: {property.squareFootage}</DialogContentText>
                <DialogContentText>도로명: {property.road_name}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleMoreInfo} color="primary">지도 이동</Button>
                <Button onClick={handleClose} color="primary">닫기</Button>
            </DialogActions>
        </Dialog>
    );
}

export default PropertyModal;
