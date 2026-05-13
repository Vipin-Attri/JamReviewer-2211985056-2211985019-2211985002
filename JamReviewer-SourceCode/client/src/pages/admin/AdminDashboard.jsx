import React, { useEffect, useState } from 'react';
import {
  getAdminStats, getAdminUsers, toggleBlock, getAdminSongs, adminDeleteSong
} from '../../api';
import Navbar from '../../components/Navbar';
import {
  Users, Music, Shield, TrendingUp, UserX, UserCheck,
  Trash2, Loader2, BarChart2, MessageCircle, Star
} from 'lucide-react';
import toast from 'react-hot-toast';

const TABS = ['Overview', 'Users', 'Songs'];

const AdminDashboard = () => {
  const [tab, setTab] = useState('Overview');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        if (tab === 'Overview') {
          const res = await getAdminStats();
          setStats(res.data.stats);
        } else if (tab === 'Users') {
          const res = await getAdminUsers();
          setUsers(res.data.users);
        } else if (tab === 'Songs') {
          const res = await getAdminSongs();
          setSongs(res.data.songs);
        }
      } catch {
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [tab]);

  const handleToggleBlock = async (userId, name, isBlocked) => {
    if (!confirm(`${isBlocked ? 'Unblock' : 'Block'} "${name}"?`)) return;
    try {
      await toggleBlock(userId);
      setUsers(users.map((u) =>
        u._id === userId ? { ...u, isBlocked: !u.isBlocked } : u
      ));
      toast.success(`User ${isBlocked ? 'unblocked' : 'blocked'}`);
    } catch {
      toast.error('Action failed');
    }
  };

  const handleDeleteSong = async (songId, title) => {
    if (!confirm(`Delete "${title}"?`)) return;
    try {
      await adminDeleteSong(songId);
      setSongs(songs.filter((s) => s._id !== songId));
      toast.success('Song deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  return (
    <div className="page-layout">
      <Navbar />
      <main className="main-content">
        <div className="dashboard-header">
          <div>
            <h1 className="page-title"><Shield size={28} className="inline-icon" /> Admin Panel</h1>
            <p className="page-subtitle">Platform management</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="tab-nav">
          {TABS.map((t) => (
            <button
              key={t}
              className={`tab-btn ${tab === t ? 'tab-btn-active' : ''}`}
              onClick={() => setTab(t)}
            >
              {t}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="loading-center"><Loader2 size={40} className="spin" /></div>
        ) : (
          <>
            {/* Overview Tab */}
            {tab === 'Overview' && stats && (
              <div>
                <div className="stats-grid">
                  <div className="stat-card">
                    <Users size={28} className="stat-icon purple" />
                    <div><p className="stat-value">{stats.totalUsers}</p><p className="stat-label">Users</p></div>
                  </div>
                  <div className="stat-card">
                    <TrendingUp size={28} className="stat-icon green" />
                    <div><p className="stat-value">{stats.totalCreators}</p><p className="stat-label">Creators</p></div>
                  </div>
                  <div className="stat-card">
                    <Music size={28} className="stat-icon blue" />
                    <div><p className="stat-value">{stats.totalSongs}</p><p className="stat-label">Songs</p></div>
                  </div>
                  <div className="stat-card">
                    <BarChart2 size={28} className="stat-icon yellow" />
                    <div><p className="stat-value">{stats.totalPlays}</p><p className="stat-label">Total Plays</p></div>
                  </div>
                  <div className="stat-card">
                    <MessageCircle size={28} className="stat-icon pink" />
                    <div><p className="stat-value">{stats.totalComments}</p><p className="stat-label">Comments</p></div>
                  </div>
                  <div className="stat-card">
                    <Star size={28} className="stat-icon orange" />
                    <div><p className="stat-value">{stats.totalRatings}</p><p className="stat-label">Ratings</p></div>
                  </div>
                </div>
              </div>
            )}

            {/* Users Tab */}
            {tab === 'Users' && (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Joined</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u._id}>
                        <td>{u.name}</td>
                        <td className="email-cell">{u.email}</td>
                        <td>
                          <span className={`role-tag role-${u.role.toLowerCase()}`}>{u.role}</span>
                        </td>
                        <td>
                          <span className={`status-tag ${u.isBlocked ? 'blocked' : 'active'}`}>
                            {u.isBlocked ? 'Blocked' : 'Active'}
                          </span>
                        </td>
                        <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                        <td>
                          <button
                            onClick={() => handleToggleBlock(u._id, u.name, u.isBlocked)}
                            className={`btn-icon-sm ${u.isBlocked ? 'success' : 'danger'}`}
                            title={u.isBlocked ? 'Unblock' : 'Block'}
                          >
                            {u.isBlocked ? <UserCheck size={16} /> : <UserX size={16} />}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {users.length === 0 && (
                  <div className="empty-state"><p>No users found.</p></div>
                )}
              </div>
            )}

            {/* Songs Tab */}
            {tab === 'Songs' && (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Creator</th>
                      <th>Singer</th>
                      <th>Movie</th>
                      <th>Year</th>
                      <th>Plays</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {songs.map((s) => (
                      <tr key={s._id}>
                        <td>{s.title}</td>
                        <td>{s.creatorId?.name || '—'}</td>
                        <td>{s.singer || '—'}</td>
                        <td>{s.movie || '—'}</td>
                        <td>{s.year || '—'}</td>
                        <td>{s.playCount}</td>
                        <td>
                          <button
                            onClick={() => handleDeleteSong(s._id, s.title)}
                            className="btn-icon-sm danger"
                            title="Delete Song"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {songs.length === 0 && (
                  <div className="empty-state"><p>No songs found.</p></div>
                )}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
