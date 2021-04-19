import React from 'react';
import '../css/MyBalanceCounter.css';

import CountUp from 'react-countup';

export default function(props) {
  return (
    <span className="my_balance">
      My Balance:&nbsp;
      <CountUp
        end={props.currentBalance}
        preserveValue={true}
        separator=","
        suffix=" 陈CHEN"
      />
    </span>
  );
}
