import React, { createContext, useContext, useState, useRef, useCallback } from 'react';
import { playSong as playSongAPI } from '../api';

const PlayerContext = createContext(null);

export const PlayerProvider = ({ children }) => {
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef(new Audio());

  const play = useCallback(async (song, songList = []) => {
    const audio = audioRef.current;

    if (currentSong?._id === song._id) {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        audio.play();
        setIsPlaying(true);
      }
      return;
    }

    audio.pause();
    audio.src = song.fileUrl;
    audio.volume = volume;

    setCurrentSong(song);
    setQueue(songList);
    const idx = songList.findIndex((s) => s._id === song._id);
    setCurrentIndex(idx);

    audio.ontimeupdate = () => setCurrentTime(audio.currentTime);
    audio.ondurationchange = () => setDuration(audio.duration);
    audio.onended = () => playNext();

    try {
      await audio.play();
      setIsPlaying(true);
      // Increment play count
      playSongAPI(song._id).catch(() => {});
    } catch (e) {
      console.error(e);
    }
  }, [currentSong, isPlaying, volume]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play();
      setIsPlaying(true);
    }
  };

  const seek = (time) => {
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const changeVolume = (vol) => {
    audioRef.current.volume = vol;
    setVolume(vol);
  };

  const playNext = useCallback(() => {
    if (currentIndex < queue.length - 1) {
      play(queue[currentIndex + 1], queue);
    }
  }, [currentIndex, queue, play]);

  const playPrev = useCallback(() => {
    if (currentIndex > 0) {
      play(queue[currentIndex - 1], queue);
    }
  }, [currentIndex, queue, play]);

  return (
    <PlayerContext.Provider
      value={{
        currentSong, isPlaying, volume, currentTime, duration,
        play, togglePlay, seek, changeVolume, playNext, playPrev,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error('usePlayer must be used within PlayerProvider');
  return ctx;
};
