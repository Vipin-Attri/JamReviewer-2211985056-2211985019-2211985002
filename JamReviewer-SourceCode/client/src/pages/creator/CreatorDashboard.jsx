import React, { useEffect, useState } from 'react';
import { getCreatorAnalytics, uploadSong, deleteSong } from '../../api';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import {
  Upload, Trash2, Music, TrendingUp, Star, MessageCircle,
  Play, ChevronDown, ChevronUp, Loader2, Plus
} from 'lucide-react';
import toast from 'react-hot-toast';

const CreatorDashboard = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [expandedSong, setExpandedSong] = useState(null);
  const [form, setForm] = useState({
    title: '', singer: '', movie: '', year: '', audio: null,
  });

  const loadAnalytics = async () => {
    try {
      const res = await getCreatorAnalytics();
      setAnalytics(res.data);
    } catch {
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadAnalytics(); }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!form.title || !form.audio) return toast.error('Title and audio file are required');

    setUploading(true);
    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('singer', form.singer);
    formData.append('movie', form.movie);
    formData.append('year', form.year);
    formData.append('audio', form.audio);

    try {
      await uploadSong(formData);
      toast.success('Song uploaded successfully!');
      setForm({ title: '', singer: '', movie: '', year: '', audio: null });
      setShowUpload(false);
      loadAnalytics();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (songId, title) => {
    if (!confirm(`Delete "${title}"?`)) return;
    try {
      await deleteSong(songId);
      toast.success('Song deleted');
      loadAnalytics();
    } catch {
      toast.error('Failed to delete');
    }
  };

  if (loading) {
    return (
      <div className="page-layout">
        <Navbar />
        <div className="loading-center"><Loader2 size={40} className="spin" /></div>
      </div>
    );
  }

  return (
    <div className="page-layout">
      <Navbar />
      <main className="main-content">
        <div className="dashboard-header">
          <div>
            <h1 className="page-title">Creator Dashboard</h1>
            <p className="page-subtitle">Welcome, {user?.name}</p>
          </div>
          <button
            className="btn-primary"
            onClick={() => setShowUpload(!showUpload)}
          >
            <Plus size={18} /> Upload Song
          </button>
        </div>

        {/* Summary Cards */}
        {analytics && (
          <div className="stats-grid">
            <div className="stat-card">
              <Music size={28} className="stat-icon purple" />
              <div>
                <p className="stat-value">{analytics.summary.totalSongs}</p>
                <p className="stat-label">Total Songs</p>
              </div>
            </div>
            <div className="stat-card">
              <Play size={28} className="stat-icon green" />
              <div>
                <p className="stat-value">{analytics.summary.totalPlays}</p>
                <p className="stat-label">Total Plays</p>
              </div>
            </div>
            <div className="stat-card">
              <Star size={28} className="stat-icon yellow" />
              <div>
                <p className="stat-value">{analytics.summary.overallAvgRating || '—'}</p>
                <p className="stat-label">Avg Rating</p>
              </div>
            </div>
          </div>
        )}

        {/* Upload Form */}
        {showUpload && (
          <div className="upload-panel">
            <h2 className="section-title"><Upload size={20} /> Upload New Song</h2>
            <form onSubmit={handleUpload} className="upload-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Song Title *</label>
                  <input
                    className="form-input"
                    placeholder="Enter song title"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Singer</label>
                  <input
                    className="form-input"
                    placeholder="Singer name"
                    value={form.singer}
                    onChange={(e) => setForm({ ...form, singer: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Movie / Album</label>
                  <input
                    className="form-input"
                    placeholder="Movie or album name"
                    value={form.movie}
                    onChange={(e) => setForm({ ...form, movie: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Year</label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="e.g. 2024"
                    value={form.year}
                    onChange={(e) => setForm({ ...form, year: e.target.value })}
                    min="1900"
                    max="2100"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Audio File * (MP3, WAV, OGG — max 50MB)</label>
                <div className="file-drop-zone">
                  <input
                    type="file"
                    accept="audio/*"
                    id="audio-upload"
                    className="file-input-hidden"
                    onChange={(e) => setForm({ ...form, audio: e.target.files[0] })}
                  />
                  <label htmlFor="audio-upload" className="file-drop-label">
                    <Upload size={32} />
                    <span>{form.audio ? form.audio.name : 'Click to choose audio file'}</span>
                  </label>
                </div>
              </div>
              <div className="upload-form-actions">
                <button type="button" onClick={() => setShowUpload(false)} className="btn-outline">
                  Cancel
                </button>
                <button type="submit" disabled={uploading} className="btn-primary">
                  {uploading ? <><Loader2 size={16} className="spin" /> Uploading...</> : 'Upload Song'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Songs List */}
        <div className="creator-songs-section">
          <h2 className="section-title"><TrendingUp size={20} /> Your Songs Analytics</h2>

          {analytics?.songs?.length === 0 ? (
            <div className="empty-state">
              <Music size={60} className="empty-icon" />
              <h3>No songs yet</h3>
              <p>Upload your first song to get started!</p>
            </div>
          ) : (
            <div className="analytics-list">
              {analytics?.songs?.map((song) => (
                <div key={song._id} className="analytics-row">
                  <div className="analytics-row-main">
                    <div className="analytics-song-info">
                      <div className="analytics-thumb"><Music size={20} /></div>
                      <div>
                        <h3 className="analytics-title">{song.title}</h3>
                        <p className="analytics-meta">
                          {[song.singer, song.movie, song.year].filter(Boolean).join(' · ')}
                        </p>
                      </div>
                    </div>

                    <div className="analytics-stats">
                      <div className="analytics-stat">
                        <Play size={14} className="stat-icon-sm green" />
                        <span>{song.playCount}</span>
                      </div>
                      <div className="analytics-stat">
                        <Star size={14} className="stat-icon-sm yellow" />
                        <span>{song.avgRating || '—'}</span>
                      </div>
                      <div className="analytics-stat">
                        <MessageCircle size={14} className="stat-icon-sm blue" />
                        <span>{song.comments?.length || 0}</span>
                      </div>
                    </div>

                    <div className="analytics-actions">
                      <button
                        onClick={() => setExpandedSong(expandedSong === song._id ? null : song._id)}
                        className="btn-icon-sm"
                      >
                        {expandedSong === song._id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                      <button
                        onClick={() => handleDelete(song._id, song.title)}
                        className="btn-icon-sm danger"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {expandedSong === song._id && (
                    <div className="analytics-comments">
                      <h4>Comments</h4>
                      {song.comments?.length === 0 ? (
                        <p className="no-comments">No comments yet</p>
                      ) : (
                        song.comments.map((c) => (
                          <div key={c._id} className="mini-comment">
                            <strong>{c.userId?.name || 'User'}:</strong> {c.text}
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CreatorDashboard;
