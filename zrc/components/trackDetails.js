import {
  html,
  css,
  useStore,
  useEffect,
} from "../../node_modules/z-js-framework/dist/z.js";
import { songStore } from "../config/store.js";

const trackDetails = () => {
  const [currentSong] = useStore(songStore);
  const songURL = `/zrc/songs/${currentSong
    .value()
    .title.trim()
    .replaceAll(" ", "_")}_${currentSong
    .value()
    .artist.trim()
    .replaceAll(" ", "_")}.mp3`;

  useEffect(() => {
    const songURL = `/zrc/songs/${currentSong
      .value()
      .title.trim()
      .replaceAll(" ", "_")}_${currentSong
      .value()
      .artist.trim()
      .replaceAll(" ", "_")}.mp3`;
    let titleSpan = document.querySelector("h3>span");
    let artisteSpan = document.querySelector("h4>span");
    let linkBtn = document.querySelector("a");
    titleSpan.innerHTML = currentSong.value().title;
    artisteSpan.innerHTML = currentSong.value().artist;
    linkBtn.href = songURL;
  }, [currentSong]);
  const details = css`
    padding: 50px 10px;
    border-block: 3px solid #0079bf;
    display: flex;
    gap: 10px;
    flex-direction: column;
    align-items: start;
    justify-content: center;
    position: relative;
    top: 50%;
    transform: translatey(-50%);
    color: #0079bf;
    & > a {
      align-self: end;
      text-decoration: none;
      color: #5bac4f;
      border: 1px solid #0079bf;
      border-radius: 10px;
      padding: 10px;
      &:hover {
        background: #0ff2;
      }
    }
    & span {
      color: #e4f0f6;
      margin-left: 5px;
      font-weight: 100;
    }
  `;
  return html`
    <div class=${details}>
      <h2>Track details</h2>
      <h3>Title: <span>${currentSong.current().title}</span></h3>
      <h4>Artiste: <span>${currentSong.value().artist}</span></h4>
      <a href=${songURL}>Download</a>
    </div>
  `;
};

export default trackDetails;
