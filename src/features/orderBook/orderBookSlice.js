import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  bids: {},
  asks: {},
  channelId: null,
};

export const orderBookSlice = createSlice({
  name: 'orderBook',
  initialState,
  reducers: {
    // Redux Toolkit allows us to write "mutating" logic in reducers. It
    // doesn't actually mutate the state because it uses the Immer library,
    // which detects changes to a "draft state" and produces a brand new
    // immutable state based off those changes
    updateBook: (state, action) => {
      const { table, price, updateObj } = action.payload;
      if (updateObj === null) {
        delete state[table][price];
      } else {
        state[table][price] = updateObj;
      }
    },
    setupBook: (state, action) => {
      state.bids = action.payload.bids;
      state.asks = action.payload.asks;
      state.channelId = action.payload.channelId;
    },
    disconnect: (state) => {
      state.bids = initialState.bids;
      state.asks = initialState.asks;
      state.channelId = initialState.channelId;
    }
  },
});

export const { updateBook, setupBook, disconnect } = orderBookSlice.actions;

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
      channel: 'book',
      symbol: 'tBTCUSD'
    }));
  };

  const bookObj = {
    asks: {},
    bids: {}
  };

  socket.onmessage = (msg) => {
    const msgJson = JSON.parse(msg.data);

    // ignore events for now
    if (msgJson.event) {
      return;
    }

    const [
      channelId
    ] = msgJson;

    // set book obj on first time using snapshot 
    if (bookObj.channelId !== channelId) {
      bookObj.channelId = channelId;

      const bookItems = msgJson[1];

      bookItems.forEach(([price, count, amount], i) => {
        const table = amount > 0 ? 'bids' : 'asks';
        const total = amount * price;
        const id = table + total;
        bookObj[table][price] = { id, count, amount, price, total };
      });

      dispatch(setupBook(bookObj));
    } else {
      const [price, count, amount] = msgJson[1];
      const table = amount > 0 ? 'bids' : 'asks';

      if (count > 0) {
        const total = amount * price;
        const id = table + total;
        const updateObj = { id, count, amount, price, total };
        dispatch(updateBook({ table, price, updateObj }));

      } else if (count === 0) {
        const updateObj = null;
        dispatch(updateBook({ table, price, updateObj }));
      }
    }
  };
};

export const disconnectFromWSChannel = () => dispatch => {
  socket.close();
  dispatch(disconnect());
};

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`
export const selectBids = state => Object.values(state.orderBook.bids).sort((a, b) => b.price - a.price);
export const selectAsks = state => Object.values(state.orderBook.asks).sort((a, b) => b.price - a.price);

export default orderBookSlice.reducer;
