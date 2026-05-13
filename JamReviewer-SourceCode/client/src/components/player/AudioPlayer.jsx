import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';

const formatTime = (t) => {
  if (!t || isNaN(t)) return '0:00';
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
};

const AudioPlayer = () => {
  const {
    currentSong, isPlaying, volume, currentTime, duration,
    togglePlay, seek, changeVolume, playNext, playPrev,
  } = usePlayer();

  if (!currentSong) return null;

  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="audio-player">
      {/* Song info */}
      <div className="player-song-info">
        <div className="player-thumb">
          <span>🎵</span>
        </div>
        <div className="player-meta">
          <p className="player-title">{currentSong.title}</p>
          <p className="player-artist">{currentSong.singer || 'Unknown Artist'}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="player-center">
        <div className="player-controls">
          <button onClick={playPrev} className="player-ctrl-btn">
            <SkipBack size={20} />
          </button>
          <button onClick={togglePlay} className="player-play-btn">
            {isPlaying ? <Pause size={22} fill="white" /> : <Play size={22} fill="white" />}
          </button>
          <button onClick={playNext} className="player-ctrl-btn">
            <SkipForward size={20} />
          </button>
        </div>

        <div className="player-progress">
          <span className="player-time">{formatTime(currentTime)}</span>
          <div
            className="progress-bar"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const ratio = (e.clientX - rect.left) / rect.width;
              seek(ratio * duration);
            }}
          >
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <span className="player-time">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Volume */}
      <div className="player-volume">
        <button onClick={() => changeVolume(volume > 0 ? 0 : 1)} className="player-ctrl-btn">
          {volume > 0 ? <Volume2 size={18} /> : <VolumeX size={18} />}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={volume}
          onChange={(e) => changeVolume(parseFloat(e.target.value))}
          className="volume-slider"
        />
      </div>
    </div>
  );
};

export default AudioPlayer;
