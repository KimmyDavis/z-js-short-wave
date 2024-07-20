import { createStore } from "z-js-framework";

const fallBackSong = {
  title: "oceans",
  artist: "Julie",
};
let storedSong = JSON.parse(localStorage.getItem("storedSong")) || fallBackSong;

export const songStore = createStore(storedSong);

// // there's a lot you can do, channel.getHistor() for example gets the store state history upto 10 previous versions
// const { getValue, setValue, subScribe, channel } = createStore({
//   name: 'z-js-framework',
//   age: 1,
// });

// // access store state
// console.log(countStore.getValue()); // 100

// // run everytime state changes
// authStore.subScribe((newState) => {
//   console.log('auth changed::', newState);
// });
