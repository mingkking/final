import './SideView.css'
import SideStar from './componoets/SideStar';
import React, { useState } from 'react';


const SideTransaction = () => {

    // 상태(state) 정의
    const [priceRange, setPriceRange] = useState(0);
    const [areaRange, setAreaRange] = useState(0);

    // 가격대 range 변경 시 처리 함수
    const handlePriceChange = (e) => {
        setPriceRange(e.target.value);
    }

    // 전용면적 range 변경 시 처리 함수
    const handleAreaChange = (e) => {
        setAreaRange(e.target.value);
    }

    

    return(
        <form className="form-container">
            <fieldset className='fieldset-container'>
                <legend  className="mt-4">아파트 조건</legend>
                    <label for="customRange1" className="form-label">가격대</label>
                    <input type="range" className="form-range" id="customRange1" value={priceRange} onChange={handlePriceChange} max={1000000}/>
                    <div className='input-value'>{priceRange.toLocaleString()}만원</div><br/>

                    <label for="disabledRange" className="form-label" style={{ marginTop: '5px' }}>전용면적</label>
                    <input type="range" className="form-range" id="disabledRange" disabled="" value={areaRange} onChange={handleAreaChange} max={200}/>
                    <div className='input-value'>{areaRange}㎡</div>
            </fieldset>

                <div className='fieldset-container'>
                    <div>교통</div>
                    <div className='side-star-container'>
                        <SideStar totalStars={5}/>
                    </div>
                    <div>편의</div>
                    <div className='side-star-container'>
                        <SideStar totalStars={5}/>
                    </div>
                    <div>교육</div>
                    <div className='side-star-container'>
                        <SideStar totalStars={5}/>
                    </div>
                    <div>조망권</div>
                    <div className='side-star-container'>
                        <SideStar totalStars={5}/>
                    </div>
                </div>
                
                
            <button type="submit" className="btn btn-primary align-right" style={{ marginTop: '20px' }}>검색</button>
        </form>
    )
}

export default SideTransaction;