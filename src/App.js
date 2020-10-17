import React from 'react';
import { OrderBook } from './features/orderBook/OrderBook';
import { Trades } from './features/trades/Trades';
import { Ticker } from './features/ticker/Ticker';

function App() {
  return (
    <div className="App">
      <OrderBook />
      <Trades />
      <Ticker />
    </div>
  );
}

export default App;
