import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Music, Star } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';

const SongCard = ({ song, songs = [] }) => {
  const { play, currentSong, isPlaying } = usePlayer();
  const navigate = useNavigate();
  const isActive = currentSong?._id === song._id;

  const handlePlay = (e) => {
    e.stopPropagation();
    play(song, songs);
  };

  return (
    <div
      className={`song-card ${isActive ? 'song-card-active' : ''}`}
      onClick={() => navigate(`/songs/${song._id}`)}
    >
      <div className="song-card-thumb">
        <div className="song-thumb-bg">
          <Music size={32} className="song-thumb-icon" />
        </div>
        <button className="song-play-btn" onClick={handlePlay}>
          {isActive && isPlaying ? (
            <div className="playing-bars">
              <span /><span /><span />
            </div>
          ) : (
            <Play fill="white" size={20} />
          )}
        </button>
      </div>

      <div className="song-card-info">
        <h3 className="song-title">{song.title}</h3>
        {song.singer && <p className="song-meta">{song.singer}</p>}
        {song.movie && <p className="song-meta movie">{song.movie}</p>}

        <div className="song-card-footer">
          <div className="song-rating">
            <Star size={13} fill="#f59e0b" color="#f59e0b" />
            <span>{song.avgRating?.toFixed(1) || '—'}</span>
            <span className="rating-count">({song.totalRatings || 0})</span>
          </div>
          {song.year && <span className="song-year">{song.year}</span>}
        </div>
      </div>
    </div>
  );
};

export default SongCard;
