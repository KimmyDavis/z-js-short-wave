import {
  html,
  css,
  useState,
  useEffect,
  useStore,
} from "../../node_modules/z-js-framework/dist/z.js";
import playlist from "../components/playlist.js";
import trackDetails from "../components/trackDetails.js";
import playerUI from "../components/playerUI.js";
import { SONGS } from "../songs/songs.js";
import { songStore } from "../config/store.js";
const Home = () => {
  const [currentSong, setCurrentSong] = useStore(songStore);
  const parentClass = css`
    width: 100vw;
    display: grid;
    grid: 1fr / 1fr 2fr 0.8fr;
    gap: 0px;
    height: 100vh;
    background: #0c3953;
    overflow: hidden;
    & > .playlistContainerClass {
      width: 100%;
      height: 100%;
      background: #094c72;
      color: white;
    }
    & > .playerUIClass {
      height: 100%;
    }
    & > .detailsUIClass {
      height: 100%;
      position: relative;
      background: #094c72;
    }
  `;
  return html`
    <div class=${parentClass}>
      <div class="playlistContainerClass">${playlist(SONGS)}</div>
      <div class="playerUIClass">${playerUI(SONGS)}</div>
      <div class="detailsUIClass">${trackDetails()}</div>
    </div>
  `;
};

export default Home;
