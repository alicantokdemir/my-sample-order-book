import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectTicker,
  subscribeToWSChannel,
  disconnectFromWSChannel,
} from './tickerSlice';
import styles from '../../App.module.css';

const formatPercentage = val => {
  if(val === undefined) {
    return '';
  }

  const percentVal = val * 100;
 
  if(percentVal >= 0) {
    return `${percentVal.toFixed(2)}%`;
  } else {
    return `(${percentVal.toFixed(2)})%`;
  }
};

export function Ticker() {
  const ticker = useSelector(selectTicker);

  const dispatch = useDispatch();

  useEffect(() => {
    window.addEventListener('online', function (e) { dispatch(subscribeToWSChannel()) });
    window.addEventListener('offline', function (e) { dispatch(disconnectFromWSChannel()) });

    // cleanup
    return () => {
      dispatch(disconnectFromWSChannel())
    }
  }, [dispatch]);


  return (
    <div>
      <div className={styles.row}>
        <div className={styles.col}>
          <h2>Ticker</h2>
          <div className={styles.row}>
            <div className={styles.col}>
              <div>
                BTC/USD
              </div>
              <div>
                VOL {ticker.VOLUME}
              </div>
              <div>
                LOW {ticker.LOW}
              </div>
            </div>

            <div className={styles.col}>
              <div>
                {ticker.LAST_PRICE}
              </div>
              <div>
                {ticker.DAILY_CHANGE} {formatPercentage(ticker.DAILY_CHANGE_RELATIVE)}
              </div>
              <div>
                HIGH {ticker.HIGH}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.row}>
        <div className={styles.col} style={{ maxWidth: 100 }}>
          <button type="button" onClick={() => dispatch(subscribeToWSChannel())}>Connect</button>
          <button type="button" onClick={() => dispatch(disconnectFromWSChannel())}>Disconnect</button>
        </div>
      </div>
    </div>
  );
}
