import React, { useContext } from 'react';
import { Typography, Fab } from '@mui/material';
import { IconCurrencyDollar } from '@tabler/icons-react';
import DashboardCard from '../../../../components/shared/DashboardCard';
import mainContext from '../contexts/MainContext';

const SubscribeTotalWon = () => {

  const value = useContext(mainContext);

  // 숫자를 원화 단위로 포맷하기
  const formatter = new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW'
  });
  const totalMoney = value.state.totalSubscribersCount * 10000;
  const formattedTotalMoney = formatter.format(totalMoney);

  return (
    <DashboardCard
      title="총 수익"
      action={
        <Fab color="secondary" size="medium" sx={{color: '#ffffff'}}>
          <IconCurrencyDollar width={24} />
        </Fab>
      }
    >
      <Typography variant="h3" style={{ marginBottom: '25px'}}>
      {formattedTotalMoney}
      </Typography>
    </DashboardCard>
  );
};

export default SubscribeTotalWon;
