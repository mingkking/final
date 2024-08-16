import React,{useState,useEffect} from 'react'
import { TextField,Autocomplete } from '@mui/material'
import axios from 'axios'
const StockAutoSearch = ({onStockSelect}) => {
  const [inputValue,setInputValue] = useState('');
  const [options, setOptions] = useState([]);

  useEffect(() => {
    if (inputValue && inputValue.length > 1) {
      const fetchData = async () => {
        try {
          console.log('Fetching data for:', inputValue);
          const response = await axios.get(`/api/stocks/autocomplete?query=${inputValue}`);
          console.log('Response:', response.data);
          setOptions(response.data);
        } catch (error) {
          console.error('Error fetching stock data:', error);
        }
      };
      fetchData();
    } else {
      setOptions([]);
    }
  }, [inputValue]);

  return (
    <Autocomplete
      options={options}
      getOptionLabel={(option) => `${option.stock_name} (${option.stock_code})`}
      renderInput={(params) => (
        <TextField 
          {...params} 
          label="주식 종목명" 
          variant="outlined" 
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
              '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
              '&.Mui-focused fieldset': { borderColor: 'rgba(255, 255, 255, 0.7)' },
            },
            '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
            '& .MuiInputBase-input': { color: '#FFFFFF' },
            '& .MuiAutocomplete-popupIndicator': { color: 'rgba(255, 255, 255, 0.7)' },
            '& .MuiAutocomplete-clearIndicator': { color: 'rgba(255, 255, 255, 0.7)' },
          }}
        />
      )}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      onChange={(event, newValue) => {
        if (newValue) {
          onStockSelect(newValue.stock_name, newValue.stock_code);
        }
      }}
      freeSolo
      fullWidth
      sx={{
        '& .MuiAutocomplete-option': {
          color: '#000000', // 옵션 텍스트 색상
          '&:hover': {
            backgroundColor: 'rgba(255, 174, 31, 0.1)', // #FFAE1F의 밝은 버전
          },
        },
      }}
    />
  );
};

export default StockAutoSearch