import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSong, getComments, addComment, deleteComment, rateSong, getUserRating } from '../api';
import { useAuth } from '../context/AuthContext';
import { usePlayer } from '../context/PlayerContext';
import StarRating from '../components/StarRating';
import Navbar from '../components/Navbar';
import {
  Play, Pause, Music, Trash2, MessageCircle, ArrowLeft,
  Star, Headphones, Calendar, User, Film
} from 'lucide-react';
import toast from 'react-hot-toast';

const SongDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { play, currentSong, isPlaying, togglePlay } = usePlayer();

  const [song, setSong] = useState(null);
  const [comments, setComments] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);
  const [submittingComment, setSubmittingComment] = useState(false);

  const isActive = currentSong?._id === id;

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getSong(id);
        setSong(res.data.song);
        setAvgRating(res.data.song.avgRating);
        setTotalRatings(res.data.song.totalRatings);
        setComments(res.data.song.comments || []);

        if (user) {
          const ratingRes = await getUserRating(id);
          setUserRating(ratingRes.data.rating || 0);
        }
      } catch {
        toast.error('Song not found');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, user, navigate]);

  const handlePlay = () => {
    if (isActive) {
      togglePlay();
    } else {
      play(song, [song]);
    }
  };

  const handleRate = async (rating) => {
    if (!user) return toast.error('Please login to rate');
    try {
      const res = await rateSong(id, { rating });
      setUserRating(rating);
      setAvgRating(res.data.avgRating);
      setTotalRatings(res.data.totalRatings);
      toast.success('Rating saved!');
    } catch {
      toast.error('Failed to rate');
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!user) return toast.error('Please login to comment');
    if (!commentText.trim()) return;
    setSubmittingComment(true);
    try {
      const res = await addComment(id, { text: commentText });
      setComments([res.data.comment, ...comments]);
      setCommentText('');
      toast.success('Comment added!');
    } catch {
      toast.error('Failed to add comment');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId);
      setComments(comments.filter((c) => c._id !== commentId));
      toast.success('Comment deleted');
    } catch {
      toast.error('Failed to delete comment');
    }
  };

  if (loading) {
    return (
      <div className="page-layout">
        <Navbar />
        <div className="loading-center"><div className="spinner" /></div>
      </div>
    );
  }

  if (!song) return null;

  return (
    <div className="page-layout">
      <Navbar />
      <main className="main-content">
        <button onClick={() => navigate(-1)} className="btn-back">
          <ArrowLeft size={18} /> Back
        </button>

        {/* Song Hero */}
        <div className="song-detail-hero">
          <div className="song-hero-art">
            <Music size={80} className="hero-music-icon" />
          </div>

          <div className="song-hero-info">
            <h1 className="song-detail-title">{song.title}</h1>

            <div className="song-detail-meta">
              {song.singer && (
                <span className="meta-chip"><User size={14} />{song.singer}</span>
              )}
              {song.movie && (
                <span className="meta-chip"><Film size={14} />{song.movie}</span>
              )}
              {song.year && (
                <span className="meta-chip"><Calendar size={14} />{song.year}</span>
              )}
              <span className="meta-chip"><Headphones size={14} />{song.playCount} plays</span>
            </div>

            <div className="song-rating-section">
              <div className="avg-rating">
                <Star size={20} fill="#f59e0b" color="#f59e0b" />
                <span className="avg-rating-num">{avgRating.toFixed(1)}</span>
                <span className="avg-rating-count">({totalRatings} ratings)</span>
              </div>
              {user && (
                <div>
                  <p className="rate-label">Your rating:</p>
                  <StarRating rating={userRating} onRate={handleRate} size={28} />
                </div>
              )}
            </div>

            <button onClick={handlePlay} className="btn-play-large">
              {isActive && isPlaying ? (
                <><Pause size={22} fill="white" /> Pause</>
              ) : (
                <><Play size={22} fill="white" /> Play Now</>
              )}
            </button>
          </div>
        </div>

        {/* Comments */}
        <div className="comments-section">
          <h2 className="section-title">
            <MessageCircle size={22} /> Comments ({comments.length})
          </h2>

          {user ? (
            <form onSubmit={handleComment} className="comment-form">
              <textarea
                className="form-input comment-textarea"
                placeholder="Share your thoughts..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                rows={3}
                maxLength={500}
              />
              <div className="comment-form-footer">
                <span className="char-count">{commentText.length}/500</span>
                <button type="submit" disabled={submittingComment || !commentText.trim()} className="btn-primary">
                  {submittingComment ? 'Posting...' : 'Post Comment'}
                </button>
              </div>
            </form>
          ) : (
            <div className="login-prompt">
              <p>Please <a href="/login">login</a> to leave a comment.</p>
            </div>
          )}

          <div className="comments-list">
            {comments.length === 0 ? (
              <div className="empty-comments">
                <MessageCircle size={40} className="empty-icon" />
                <p>No comments yet. Be the first!</p>
              </div>
            ) : (
              comments.map((c) => (
                <div key={c._id} className="comment-card">
                  <div className="comment-header">
                    <div className="comment-avatar">{c.userId?.name?.[0]?.toUpperCase() || 'U'}</div>
                    <div>
                      <p className="comment-author">{c.userId?.name || 'User'}</p>
                      <p className="comment-time">
                        {new Date(c.createdAt).toLocaleDateString('en-US', {
                          month: 'short', day: 'numeric', year: 'numeric',
                        })}
                      </p>
                    </div>
                    {user && (user._id === c.userId?._id || user.role === 'ADMIN') && (
                      <button
                        onClick={() => handleDeleteComment(c._id)}
                        className="btn-delete-comment"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                  <p className="comment-text">{c.text}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default SongDetail;
