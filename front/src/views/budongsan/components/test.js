import React, { useEffect, useState } from 'react';

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/budongsanMapData', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => setData(data))
    .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <div>
      {data ? <p>Data: {JSON.stringify(data)}</p> : <p>Loading...</p>}
    </div>
  );
}

export default App;
