import React from 'react';
import { useSelector } from 'react-redux';
import { selectRows } from '../store/transactionsSlice';

import '../css/TransactionsTable.css';

import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Table from "@material-ui/core/Table";
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

export default function TransactionsTable() {
  const rows = useSelector(selectRows);

  return (
    <TableContainer
      className="transaction_table"
      component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align="left">Address</TableCell>
            <TableCell align="right">Action</TableCell>
            <TableCell align="right">Amount</TableCell>
            <TableCell align="right">Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell component="th" scope="row">
                <Link
                  color="textPrimary"
                  underline="none"
                  href={'https://ropsten.etherscan.io/address/'+row.address}
                  target="_blank">
                  {row.address}
                </Link>
              </TableCell>
              <TableCell align="right">{row.action}</TableCell>
              <TableCell align="right">{Math.round(row.amount).toLocaleString()}</TableCell>
              <TableCell align="right">
                {new Date(row.timestamp).toLocaleString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
