import { configureStore } from '@reduxjs/toolkit';
import orderBookReducer from '../features/orderBook/orderBookSlice';
import tradesReducer from '../features/trades/tradesSlice';
import tickerReducer from '../features/ticker/tickerSlice';

export default configureStore({
  reducer: {
    orderBook: orderBookReducer,
    trades: tradesReducer,
    ticker: tickerReducer,
  },
});
