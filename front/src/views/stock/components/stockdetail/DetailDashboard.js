import React from 'react'

const DetailDashboard = (props) => {
  return (
    <div>
        <h2 className="text-2xl font-bold mb-4">{props.latestData.name} ({props.latestData.stock_code})</h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p>종가: {props.latestData.closing_price?.toLocaleString()} 원</p>
              <p>시가: {props.latestData.opening_price?.toLocaleString()} 원</p>
              <p>고가: {props.latestData.high_price?.toLocaleString()} 원</p>
              <p>저가: {props.latestData.low_price?.toLocaleString()} 원</p>
            </div>
            <div>
              <p>날짜: {props.latestData.record_date}</p>
              <p>유형: {props.latestData.stock_type}</p>
            </div>
          </div>
      </div>
  )
}

export default DetailDashboard;
