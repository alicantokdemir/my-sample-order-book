import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  ticker: {}
};

export const tickerSlice = createSlice({
  name: 'ticker',
  initialState,
  reducers: {
    // Redux Toolkit allows us to write "mutating" logic in reducers. It
    // doesn't actually mutate the state because it uses the Immer library,
    // which detects changes to a "draft state" and produces a brand new
    // immutable state based off those changes
    updateTicker: (state, action) => {
      state.ticker = action.payload;
    },
    disconnect: (state) => {
      state.ticker = initialState.ticker;
    }
  },
});

export const { updateTicker, disconnect } = tickerSlice.actions;

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
      channel: 'ticker',
      symbol: 'tBTCUSD'
    }));
  };

  socket.onmessage = (msg) => {
    const msgJson = JSON.parse(msg.data);

    // ignore if not return array
    if(!Array.isArray(msgJson[1])) {
      return;
    }

    // ignore events for now
    if (msgJson.event) {
      return;
    }

    console.log('msg json => ', msgJson);

    const [
      BID,
      BID_SIZE,
      ASK,
      ASK_SIZE,
      DAILY_CHANGE,
      DAILY_CHANGE_RELATIVE,
      LAST_PRICE,
      VOLUME,
      HIGH,
      LOW
    ] = msgJson[1];

    dispatch(updateTicker({
      BID,
      BID_SIZE,
      ASK,
      ASK_SIZE,
      DAILY_CHANGE,
      DAILY_CHANGE_RELATIVE,
      LAST_PRICE,
      VOLUME,
      HIGH,
      LOW
    }));
  };
};

export const disconnectFromWSChannel = () => dispatch => {
  socket.close();
  dispatch(disconnect());
};

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`
export const selectTicker = state => state.ticker.ticker;

export default tickerSlice.reducer;
