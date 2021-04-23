import React from 'react';
import { useSelector } from 'react-redux';
import { getCurrentBalance } from '../store/currentBalanceSlice';

import '../css/MyBalanceCounter.css';

import CountUp from 'react-countup';

export default function MyBalanceCounter() {
  const count = useSelector(getCurrentBalance);

  return (
    <span className="my_balance">
      My Balance:{' '}
      <CountUp
        end={count}
        preserveValue={true}
        separator=","
        suffix=" 陈CHEN"
      />
    </span>
  );
}
