import React, { useEffect, useState, useCallback } from 'react';
import { getSongs } from '../api';
import SongCard from '../components/SongCard';
import Navbar from '../components/Navbar';
import { Search, SlidersHorizontal, Music, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const Home = () => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ singer: '', movie: '', year: '' });
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });

  const fetchSongs = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const res = await getSongs(params);
      setSongs(res.data.songs);
      setPagination(res.data.pagination);
    } catch {
      toast.error('Failed to load songs');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchSongs(); }, [fetchSongs]);

  const handleSearch = (val) => {
    setSearch(val);
    fetchSongs({ search: val, ...filters });
  };

  const handleFilter = () => {
    fetchSongs({ search, ...filters });
    setShowFilters(false);
  };

  const clearFilters = () => {
    setSearch('');
    setFilters({ singer: '', movie: '', year: '' });
    fetchSongs();
  };

  const hasFilters = search || filters.singer || filters.movie || filters.year;

  return (
    <div className="page-layout">
      <Navbar onSearch={handleSearch} />

      <main className="main-content">
        <div className="home-header">
          <div>
            <h1 className="page-title">Discover Music</h1>
            <p className="page-subtitle">{songs.length} songs available</p>
          </div>
          <button
            className={`btn-filter ${showFilters ? 'btn-filter-active' : ''}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal size={18} />
            Filters
            {hasFilters && <span className="filter-dot" />}
          </button>
        </div>

        {showFilters && (
          <div className="filter-panel">
            <div className="filter-grid">
              <div className="form-group">
                <label>Singer</label>
                <input
                  className="form-input"
                  placeholder="e.g. Arijit Singh"
                  value={filters.singer}
                  onChange={(e) => setFilters({ ...filters, singer: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Movie</label>
                <input
                  className="form-input"
                  placeholder="e.g. Dilwale"
                  value={filters.movie}
                  onChange={(e) => setFilters({ ...filters, movie: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Year</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="e.g. 2022"
                  value={filters.year}
                  onChange={(e) => setFilters({ ...filters, year: e.target.value })}
                />
              </div>
            </div>
            <div className="filter-actions">
              <button onClick={clearFilters} className="btn-outline">Clear All</button>
              <button onClick={handleFilter} className="btn-primary">Apply Filters</button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="loading-center">
            <Loader2 size={40} className="spin" />
          </div>
        ) : songs.length === 0 ? (
          <div className="empty-state">
            <Music size={64} className="empty-icon" />
            <h3>No songs found</h3>
            <p>Try different search terms or filters</p>
            <button onClick={clearFilters} className="btn-primary" style={{marginTop:'1rem'}}>Clear Search</button>
          </div>
        ) : (
          <div className="songs-grid">
            {songs.map((song) => (
              <SongCard key={song._id} song={song} songs={songs} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
