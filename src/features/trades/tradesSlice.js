import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  trades: [],
  channelId: null,
};

export const tradesSlice = createSlice({
  name: 'trades',
  initialState,
  reducers: {
    // Redux Toolkit allows us to write "mutating" logic in reducers. It
    // doesn't actually mutate the state because it uses the Immer library,
    // which detects changes to a "draft state" and produces a brand new
    // immutable state based off those changes
    updateTrades: (state, action) => {
      state.trades.push(action.payload);
      state.trades = state.trades.slice(state.trades.length - 15);
    },
    setupTrades: (state, action) => {
      state.trades = action.payload.trades.slice(state.trades.length - 15);
      state.channelId = action.payload.channelId;
    },
    disconnect: (state) => {
      state.trades = initialState.trades;
    }
  },
});

export const { updateTrades, setupTrades, disconnect } = tradesSlice.actions;

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched
let socket;
export const subscribeToWSChannel = () => dispatch => {
  socket = new WebSocket('wss://api-pub.bitfinex.com/ws/2');
  socket.onopen = () => {
    socket.send(JSON.stringify({
      event: 'subscribe',
      channel: 'trades',
      symbol: 'tBTCUSD'
    }));
  };

  const tradesObj = {
    trades: []
  };

  socket.onmessage = (msg) => {
    const msgJson = JSON.parse(msg.data);

    // ignore events for now
    if (msgJson.event) {
      return;
    }

    const [
      channelId,
      type,
    ] = msgJson;

    // set book obj on first time using snapshot 
    if (tradesObj.channelId !== channelId) {
      tradesObj.channelId = channelId;

      tradesObj.trades = msgJson[1].map(([id, mts, amount, price]) => ({ id: id + mts, mts, amount, price }));

      dispatch(setupTrades(tradesObj));
    } else if(type === 'te') {
      const [
        id,
        mts,
        amount,
        price
      ] = msgJson[2];

      const updateObj = {
        id: id + mts,
        mts,
        amount,
        price
      };
      dispatch(updateTrades(updateObj));
    };
  };
};

export const disconnectFromWSChannel = () => dispatch => {
  socket.close();
  dispatch(disconnect());
};

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`
export const selectTrades = state => state.trades.trades;

export default tradesSlice.reducer;
