import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectTrades,
  subscribeToWSChannel,
  disconnectFromWSChannel,
} from './tradesSlice';
import styles from '../../App.module.css';

import { Table } from '../../components/table/Table';

export function Trades() {
  const trades = useSelector(selectTrades);

  const [precision, setPrecision] = useState(1);

  const dispatch = useDispatch();

  useEffect(() => {
    window.addEventListener('online', function (e) { dispatch(subscribeToWSChannel()) });
    window.addEventListener('offline', function (e) { dispatch(disconnectFromWSChannel()) });

    // cleanup
    return () => {
      dispatch(disconnectFromWSChannel())
    }
  }, [dispatch]);

  const columns = [
    {
      id: 1,
      style: {},
      key: 'mts',
      name: 'Time',
      formatValue: (val) => new Date(val).toString(),
    },
    {
      id: 2,
      style: {},
      key: 'price',
      name: 'Price',
      formatValue: (val) => val.toFixed(precision),
    },
    {
      id: 3,
      style: {},
      key: 'amount',
      name: 'Amount',
    },
  ];

  return (
    <div>
      <div className={styles.row}>
        <div className={styles.col}>
          <h2>Trades</h2>
          <Table rows={trades} columns={columns} />
        </div>
      </div>
      <div className={styles.row}>
        <div className={styles.col} style={{ maxWidth: 100 }}>
          <button type="button" onClick={() => dispatch(subscribeToWSChannel())}>Connect</button>
          <button type="button" onClick={() => dispatch(disconnectFromWSChannel())}>Disconnect</button>
          <button type="button" disabled={precision === 2} onClick={() => setPrecision(precision + 1)}>+ Precision</button>
          <button type="button" disabled={precision === 1} onClick={() => setPrecision(precision - 1)}>- Precision</button>
        </div>
      </div>
    </div>
  );
}
