
import { styled } from '@mui/material/styles';
import Slider from 'react-slick';
import { Paper } from '@mui/material';

export const StyledSlide = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    textAlign: 'center',
    backgroundColor: theme.palette.primary.light,
    width: '100%',
    boxSizing: 'border-box',
}));

export const CustomSlider = styled(Slider)(({ theme }) => ({
    '& .slick-slide': {
        margin: '0 10px',
    },
    '& .slick-track': {
        display: 'flex',
    },
    '& .slick-dots': {
        display: 'none !important', // 도트 숨기기
    },
}));
