import {
  html,
  css,
  reactive,
  List,
  useEffect,
  useStore,
} from "/node_modules/z-js-framework/dist/z.js";
import { songStore } from "../config/store.js";

const playlist = (songs) => {
  const [currentSong, setCurrentSong] = useStore(songStore);

  setTimeout(() => {
    setCurrentSong(currentSong.current());
  }, 100);

  const playListClass = css`
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 0px;
    padding: 50px 5px 20px 5px;
    overflow-y: scroll;
    scrollbar-color: red transparent;
    scrollbar-width: none;
    height: 100vh;
    & > h2 {
      width: calc(100vw / 3.8);
      color: #5ba4cf;
      font-size: 2em;
      position: fixed;
      top: 0;
      left: 0;
      background: #094c72;
    }
    & > li {
      padding: 10px 0 10px 5px;
      border-block: solid 1px #0079bf;
      font-size: 0.9em;
      user-select: none;
      &:hover {
        background: #fff2;
      }
      & > p {
        color: #5bac4f;
        margin-left: 5px;
      }
    }
    & .highlight {
      background: #fff2;
    }
  `;

  useEffect(() => {
    let currentTitle = currentSong.current().title.trim().replaceAll(" ", "-");
    let allSongElms = [...document.querySelectorAll("li")];
    for (let songElm of allSongElms) {
      songElm.classList.remove("highlight");
      if (songElm.classList.contains(currentTitle)) {
        songElm.classList.add("highlight");
        songElm.scrollIntoView();
      }
    }
  }, [currentSong]);
  const songItem = (song) => {
    return html`
      <li
        onclick=${() => setCurrentSong(song)}
        class=${song.title.trim().replaceAll(" ", "-")}
      >
        <h2>${song.title}</h2>
        <p>${song.artist}</p>
      </li>
    `;
  };
  let UI = () => html` <ul class=${playListClass} ref="songRef">
    <h2>Playlist</h2>
    ${List({
      ref: "songRef",
      items: songs,
      render: ({ item: props }) => songItem({ ...props }),
    })}
  </ul>`;
  return reactive(UI);
};

export default playlist;
