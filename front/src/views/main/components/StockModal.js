import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';

function StockModal({ open, handleClose, stock }) {
    const navigate = useNavigate(); // useNavigate 훅을 사용하여 네비게이션 기능 추가

    const handleMoreInfo = () => {
        navigate('/stock'); // "/stock" 페이지로 이동
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>{stock.apartMentName}</DialogTitle>
            <DialogContent>
                {/* <DialogContentText> {stock.}</DialogContentText>
                <DialogContentText> {stock.}</DialogContentText>
                <DialogContentText> {stock.}</DialogContentText>
                <DialogContentText> {stock.}</DialogContentText>
                <DialogContentText> {stock.}</DialogContentText>
                <DialogContentText> {stock.}</DialogContentText> */}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleMoreInfo} color="primary">주식페이지 이동</Button>
                <Button onClick={handleClose} color="primary">닫기</Button>
            </DialogActions>
        </Dialog>
    );
}

export default StockModal;
