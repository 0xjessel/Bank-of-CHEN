import React from 'react';

import CountUp from 'react-countup';

export default function(props) {
  return (
    <span>
      Total Token Supply:&nbsp;
      <CountUp
        end={props.tokenSupply}
        preserveValue={true}
        separator=","
        suffix=" 陈CHEN"
      />
    </span>
  );
}
