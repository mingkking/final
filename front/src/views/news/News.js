import React, { useState } from 'react';
import './News.css';
import Stock from './components/NewsStock';
import RealEstate from './components/NewsRealEstate';
import Coin from './components/NewsCoin';
import NewsMain from './components/NewsMain';

function News() {
    const [activeComponent, setActiveComponent] = useState(null);
  
    const getComponent = () => {
      switch (activeComponent) {
        case 'stock':
          return <Stock />;
        case 'realEstate':
            return  <RealEstate />;
        case 'coin':
            return <Coin />;
        default:
          return <NewsMain />;
      }
    };
  
    return (
      <div>
        <nav>
          <ul>
            <li className='newsLi'>
              <span className="assetType" onClick={() => setActiveComponent('stock')}>주식</span>
              <span className="assetType" onClick={() => setActiveComponent('realEstate')}>부동산</span>
              <span className="assetType" onClick={() => setActiveComponent('coin')}>코인</span>
            </li>
          </ul>
        </nav>
        <div className="newsContent">
          {getComponent()}
        </div>
      </div>
    );
  }

export default News;
