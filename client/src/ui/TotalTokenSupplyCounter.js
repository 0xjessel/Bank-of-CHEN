import React from 'react';
import { useSelector } from 'react-redux';
import { getTokenSupply } from '../store/tokenSupplySlice';

import CountUp from 'react-countup';

export default function TotalTokenSupplyCounter() {
  const count = useSelector(getTokenSupply);

  return (
    <span>
      Total Token Supply:&nbsp;
      <CountUp
        end={count}
        preserveValue={true}
        separator=","
        suffix=" 陈CHEN"
      />
    </span>
  );
}
