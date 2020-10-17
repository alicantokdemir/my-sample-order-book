import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectAsks,
  selectBids,
  subscribeToWSChannel,
  disconnectFromWSChannel,
} from './orderBookSlice';
import styles from '../../App.module.css';

import { Table } from '../../components/table/Table';

export function OrderBook() {
  const asks = useSelector(selectAsks);
  const bids = useSelector(selectBids);

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
      key: 'count',
      name: 'Count'
    },
    {
      id: 2,
      style: {},
      key: 'amount',
      name: 'Amount',
    },
    {
      id: 3,
      style: {},
      key: 'total',
      name: 'Total',
      formatValue: (val) => val.toFixed(precision)
    },
    {
      id: 4,
      style: {},
      key: 'price',
      name: 'Price',
      formatValue: (val) => val.toFixed(precision)
    },
  ];

  const bidColumns = [...columns].reverse();

  return (
    <div>
      <div className={styles.row}>
        <div className={styles.col}>
          <h2>Asks</h2>
          <Table rows={asks} columns={columns} />
        </div>
        <div className={styles.col}>
          <h2>Bids</h2>
          <Table rows={bids} columns={bidColumns} />
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
