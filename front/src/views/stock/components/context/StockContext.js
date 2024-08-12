import React, { createContext, useState, useContext } from 'react';

const StockContext = createContext();

export const StockProvider = ({ children }) => {
  const [stockInfo, setStockInfo] = useState(null);

  return (
    <StockContext.Provider value={{ stockInfo, setStockInfo }}>
      {children}
    </StockContext.Provider>
  );
};

export const useStock = () => useContext(StockContext);

export default StockContext;