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
      renderInput={(params) => <TextField {...params} label="주식 종목명" variant="outlined" />}
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
    />
  );
};
export default StockAutoSearch
