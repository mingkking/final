import React, { useContext } from 'react';
import BudongsanContext from './BudongsanContext';

const SomeComponent = () => {
  const contextValue = useContext(BudongsanContext);

  if (!contextValue) {
    console.error('Context is undefined');
    return null;
  }

  const { state: { userNum } } = contextValue;

  return (
    <div>
      User Number: {userNum}
    </div>
  );
};

export default SomeComponent;
