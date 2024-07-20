import {
  html,
  css,
  useEffect,
  getRef,
  useState,
  useStore,
} from "z-js-framework";
import { songStore } from "../config/store.js";

const playerUI = (songs) => {
  const musicUI = css`
    width: 100%;
    height: 100vh;
    & > .success {
      display: grid;
      grid: 1fr 1fr 5fr 1fr 1fr/ 1fr;
      width: 100%;
      height: 100%;
      & > .title {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2.5em;
        font-weight: 500;
        color: #5bac4f;
        text-transform: uppercase;
      }
      & > .volume {
        display: flex;
        flex-direction: column;
        border-block: 1px solid #5bac4f;
        justify-content: center;
        padding: 10px 10px;
        & > span {
          font-size: 1.5em;
          color: #0079bf;
        }
        & .volume-percentage {
          color: #bcd9ea;
        }
      }
      & > .poster {
        width: 100%;
        display: grid;
        place-items: center;
        & > img {
          width: max(45%, 200px);
          aspect-ratio: 1;
          object-fit: cover;
          border-radius: 10px;
        }
      }
      & > .buttons {
        display: grid;
        place-items: center;
        & > .container {
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2em;
          gap: 50px;
          border: 1px solid #5bac4f;
          border-radius: 20px;
          padding: 10px;
          color: #0079bf;
          text-shadow: -1px -1px 0 #5bac4f, 1px -1px 0 #0079bf,
            -1px 1px 0 #0079bf, 1px 1px 0 #0079bf;
          & > i {
            cursor: pointer;
          }
        }
      }
      & > .progressBar {
        position: relative;
        display: flex;
        flex-direction: row;
        align-items: cener;
        justify-content: center;
        width: 100%;
        color: #5bac4f;
        & > .progress {
          margin-inline: 10px auto;
        }
        & > .duration {
          margin-inline: auto 10px;
        }
        & > input {
          width: 80%;
        }
        & > .seek-bar {
          position: absolute;
          bottom: 0;
        }
      }
    }
  `;
  const [activeSong, setActiveSong] = useStore(songStore);
  let currentSong = activeSong.current();
  songStore.subscribe((k) => {
    currentSong = activeSong.current();
  });

  const [playing, setPlaying] = useState(false);
  const togglePlaying = () => {
    let current = playing.current();
    setPlaying(!current);
  };
  const prevOrNext = (option) => {
    let currentIndex = findIndex(currentSong, songs);
    if (option == "next") {
      let nextIndex = currentIndex >= songs.length - 1 ? 0 : currentIndex + 1;
      setActiveSong(songs[nextIndex]);
    } else if (option == "prev") {
      let prevIndex = currentIndex <= 0 ? songs.length - 1 : currentIndex - 1;
      setActiveSong(songs[prevIndex]);
    }
  };
  function findIndex(element, array) {
    for (let i = 0, k = array.length; i < k; i++) {
      if (deepComp(array[i], element)) return i;
    }
    return -1;
  }
  function deepComp(obj1, obj2) {
    for (let prop of Object.keys(obj1)) {
      if (obj1[prop] != obj2[prop]) return false;
    }
    return true;
  }
  const loadSong = (song, audio, image, title, durationElm, seekElm, play) => {
    const songURL = `/zrc/songs/${song.title
      .trim()
      .replaceAll(" ", "_")}_${song.artist.trim().replaceAll(" ", "_")}.mp3`;
    const posterURL = `/zrc/posters/${song.title
      .trim()
      .replaceAll(" ", "_")}.jpg`;
    const loading = document.querySelector(".loading");
    const success = document.querySelector(".success");
    success.style.display = "none";
    loading.style.display = "block";
    fetch(songURL).then((data) => {
      audio.src = songURL;
      image.src = posterURL;
      title.innerHTML = song.title;
      loading.style.display = "none";
      success.style.display = "grid";
      audio.onloadedmetadata = () => {
        durationElm.innerHTML = parseTime(audio.duration);
        seekElm.value = 0;
        setPlaying(play);
      };
    });
  };
  document.onreadystatechange = (e) => {
    if (document.readyState === "complete") {
      const audio = document.querySelector("audio");
      const image = document.querySelector("img");
      const title = document.querySelector(".title");
      const seekBar = document.querySelector(".seek-bar");
      const progressTime = document.querySelector(".progress");
      const durationTime = document.querySelector(".duration");
      const volumeBar = document.querySelector(".volume");
      const volumePercent = document.querySelector(".volume-percentage");
      loadSong(currentSong, audio, image, title, durationTime, seekBar, false);
      useEffect(() => {
        loadSong(currentSong, audio, image, title, durationTime, seekBar, true);
        localStorage.setItem("storedSong", JSON.stringify(currentSong));
      }, [activeSong]);
      useEffect(() => {
        seekBar.value = 0;
        volumePercent.innerHTML = " 100%";
      }, []);
      useEffect(() => {
        const playButton = document.querySelector(".play-pause");
        if (playing.current()) {
          audio.play();
          playButton.classList.remove("fa-play");
          playButton.classList.add("fa-pause");
        } else {
          audio.pause();
          playButton.classList.remove("fa-pause");
          playButton.classList.add("fa-play");
        }
      }, [playing]);

      const adjustVolume = (e) => {
        audio.volume = e.target.value;
        volumePercent.innerHTML = " " + Math.round(audio.volume * 100) + "%";
      };

      const updateProgress = (time) => {
        progressTime.innerHTML = parseTime(time);
      };

      const updateTime = (e) => {
        audio.currentTime = (100 * audio.duration * e.target.value) / 100;
      };
      const updateSliderAndTime = () => {
        seekBar.value = audio.currentTime / audio.duration;
        updateProgress(audio.currentTime);
      };
      audio.ontimeupdate = updateSliderAndTime;
      audio.onended = () => prevOrNext("next");
      audio.onpause = () => setPlaying(false);
      audio.onplay = () => setPlaying(true);
      volumeBar.addEventListener("input", adjustVolume);

      seekBar.addEventListener("input", updateTime);
    }
  };

  const parseTime = (secs) => {
    let hrs = secs ? Math.floor(secs / (60 * 60)) : 0;
    hrs = String(hrs).padStart(2, "0");
    let mins = secs ? Math.floor(secs / 60) : 0;
    mins = String(mins).padStart(2, "0");
    let rem = secs ? Math.round(secs % 60) : 0;
    rem = String(rem).padStart(2, "0");
    if (rem > 59) {
      rem = 0;
      mins++;
    }
    return hrs + ":" + mins + ":" + rem;
  };
  return html`
    <div class=${musicUI}>
      <div class="loading">
        <div class="cont"><div class="loader"></div></div>
      </div>
      <div class="success">
        <div class="title"></div>
        <div class="volume">
          <span>Volume: <span class="volume-percentage"></span></span>
          <input class="volume" type="range" min="0" max="1" step="0.001" />
        </div>
        <div class="poster">
          <img />
          <audio ref="audio">You dont support this audio</audio>
        </div>
        <div class="buttons">
          <div class="container">
            <i
              class="fa-solid fa-backward"
              onclick=${() => prevOrNext("prev")}
            ></i>
            <i class="play-pause fa-solid fa-play" onclick=${togglePlaying}></i>
            <i
              class="fa-solid fa-forward"
              onclick=${() => prevOrNext("next")}
            ></i>
          </div>
        </div>
        <div class="progressBar">
          <span class="progress">0:0</span>
          <input class="seek-bar" type="range" min="0" max="1" step="0.001" />
          <span class="duration">0:0</span>
        </div>
      </div>
    </div>
  `;
};

export default playerUI;
