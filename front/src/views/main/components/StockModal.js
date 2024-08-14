import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';

function StockModal({ open, handleClose, stock }) {
    const navigate = useNavigate(); // useNavigate 훅을 사용하여 네비게이션 기능 추가

    const handleMoreInfo = () => {
        if (stock && stock.stock_code) {
            navigate(`/stock/${stock.stock_code}`);
        } else {
            console.error('Stock code is undefined');
            // 오류 처리 또는 기본 주식 페이지로 이동
            navigate('/stock');
        }
    };
    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>{stock.apartMentName}</DialogTitle>
            <DialogContent>
                <DialogContentText> {stock.stock_name}</DialogContentText>
                <DialogContentText> 종가:{stock.closing_price}</DialogContentText>
                <DialogContentText> 고가:{stock.high_price}</DialogContentText>
                <DialogContentText> 저가:{stock.low_price}</DialogContentText>
                <DialogContentText> 거래량:{stock.trading_volume}</DialogContentText>
                <DialogContentText> {stock.record_date}(기준)</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleMoreInfo} color="primary">주식페이지 이동</Button>
                <Button onClick={handleClose} color="primary">닫기</Button>
            </DialogActions>
        </Dialog>
    );
}

export default StockModal;
