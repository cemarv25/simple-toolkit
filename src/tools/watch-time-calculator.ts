type SelectedItem = {
    id: string;
    name: string;
    duration: number; // in minutes
    type: 'tv' | 'movie';
    season?: number;
    episode?: number;
};

export function render(container: HTMLElement) {
    container.innerHTML = `
    <div class="watch-time-tool">
        <h2>Watch Time Calculator</h2>
        <div class="tool-content glass">
            <div class="mode-selector">
                <button id="mode-tv" class="mode-btn active">TV Shows</button>
                <button id="mode-movies" class="mode-btn">Movies</button>
            </div>
            <div class="search-section">
                <div class="input-group">
                    <label for="search-input">Search for a show or movie</label>
                    <div class="search-box">
                        <input type="text" id="search-input" placeholder="e.g. The Office, Harry Potter..." />
                        <button id="search-btn" class="primary-btn">Search</button>
                    </div>
                    <p id="movies-coming-soon" class="help-text hidden">Movie search is coming soon.</p>
                </div>
            </div>

            <div id="loading-indicator" class="loading hidden">
                <div class="spinner"></div>
                <p>Searching...</p>
            </div>

            <div id="results-container" class="results-list hidden"></div>

            <div class="data-attribution">
                <div class="attribution-item">
                    <img src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg" alt="TMDB Logo" />
                    <p>Movies: This product uses the TMDB API but is not endorsed or certified by TMDB.</p>
                </div>
                <div class="attribution-item">
                    <p>Series: Data provided by <a href="https://www.tvmaze.com/" target="_blank">TVmaze</a>. Licensed by <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank">CC BY-SA</a>.</p>
                </div>
            </div>

            <div id="selection-summary" class="summary-box hidden">
                <div class="summary-content">
                    <div class="summary-stats">
                        <div class="stat-item">
                            <span class="stat-value" id="total-time">0</span>
                            <span class="stat-label">Total Hours</span>
                        </div>
                        <div id="time-formatted" class="time-formatted">0d 0h 0m</div>
                    </div>
                    <button id="clear-selection" class="text-link">Clear All</button>
                </div>
            </div>
        </div>
    </div>

    <style>
        .watch-time-tool {
            max-width: 800px;
            margin: 0 auto;
        }
        .tool-content {
            padding: 2rem;
            border-radius: 12px;
        }
        label {
            display: block;
            margin-bottom: 8px;
            color: var(--text-secondary);
            font-size: 0.9rem;
        }
        .mode-selector {
            display: flex;
            gap: 10px;
            margin-bottom: 1.5rem;
            background: rgba(255, 255, 255, 0.05);
            padding: 5px;
            border-radius: 10px;
            border: 1px solid var(--glass-border);
        }
        .mode-btn {
            flex: 1;
            padding: 10px;
            border: none;
            background: transparent;
            color: var(--text-secondary);
            cursor: pointer;
            border-radius: 8px;
            font-weight: 500;
            transition: all 0.3s;
        }
        .mode-btn.active {
            background: var(--accent-color);
            color: white;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }
        .search-box {
            display: flex;
            gap: 10px;
        }
        .search-box input {
            flex: 1;
            padding: 12px 20px;
            border-radius: 8px;
            border: 1px solid var(--glass-border);
            background: rgba(255, 255, 255, 0.1);
            color: var(--text-primary);
            outline: none;
        }
        .search-box input:focus {
            border-color: #4facfe;
            background: rgba(255, 255, 255, 0.15);
        }
        .primary-btn {
            width: auto;
            padding: 0 30px;
            border-radius: 8px;
            border: none;
            background: linear-gradient(90deg, #4facfe 0%, #00f2fe 100%);
            color: white;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.1s, opacity 0.2s;
            height: 46px; /* Match input height */
        }
        .primary-btn:active {
            transform: scale(0.98);
        }
        .primary-btn:hover {
            opacity: 0.9;
        }
        .settings-box {
            margin-top: 1rem;
            padding: 1rem;
            border-radius: 8px;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid var(--glass-border);
        }
        .help-text {
            font-size: 0.8rem;
            color: var(--text-secondary);
            margin-top: 0.5rem;
        }
        .help-text a {
            color: var(--accent-color);
            text-decoration: none;
        }
        .results-list {
            margin-top: 2rem;
            display: grid;
            gap: 15px;
        }
        .result-card {
            display: flex;
            gap: 15px;
            padding: 15px;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 10px;
            border: 1px solid var(--glass-border);
            transition: transform 0.2s;
        }
        .result-card:hover {
            transform: translateY(-2px);
        }
        .result-image {
            width: 80px;
            height: 120px;
            object-fit: cover;
            border-radius: 6px;
            background: rgba(255, 255, 255, 0.1);
        }
        .result-info {
            flex: 1;
        }
        .result-info h3 {
            margin: 0 0 5px 0;
            font-size: 1.1rem;
        }
        .result-meta {
            font-size: 0.9rem;
            color: var(--text-secondary);
            margin-bottom: 10px;
        }
        .summary-box {
            position: sticky;
            bottom: 20px;
            margin-top: 2rem;
            padding: 1.5rem;
            background: rgba(90, 90, 120, 0.7);
            backdrop-filter: blur(10px);
            border-radius: 12px;
            border: 1px solid var(--glass-border);
            box-shadow: 0 10px 10px rgba(0, 0, 0, 0.1);
            z-index: 5;
        }
        .summary-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .summary-stats {
            display: flex;
            align-items: baseline;
            gap: 15px;
        }
        .stat-item {
            display: flex;
            flex-direction: column;
        }
        .stat-value {
            font-size: 1.8rem;
            font-weight: 800;
            color: var(--accent-color);
        }
        .stat-label {
            font-size: 0.8rem;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: var(--text-secondary);
        }
        .time-formatted {
            font-size: 1.2rem;
            font-weight: 500;
            color: var(--text-primary);
        }
        .text-link {
            background: none;
            border: none;
            color: var(--text-secondary);
            text-decoration: underline;
            cursor: pointer;
            font-size: 0.9rem;
        }
        .loading {
            text-align: center;
            padding: 2rem;
        }
        .spinner {
            width: 30px;
            height: 30px;
            border: 3px solid rgba(255, 255, 255, 0.1);
            border-top-color: var(--accent-color);
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 10px;
        }
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        .error {
            color: #ff4d4d;
            padding: 1rem;
            text-align: center;
        }
        .error-box {
            background: rgba(255, 77, 77, 0.1);
            border: 1px solid #ff4d4d;
            border-radius: 8px;
            padding: 1rem;
            margin-top: 1rem;
            color: var(--text-primary);
        }
        .empty-state {
            color: var(--text-secondary);
            text-align: center;
            padding: 2rem;
            font-style: italic;
        }
        .data-attribution {
            margin-top: 2rem;
            padding-top: 1rem;
            border-top: 1px solid var(--glass-border);
            display: flex;
            flex-direction: column;
            gap: 12px;
            opacity: 0.6;
        }
        .attribution-item {
            display: flex;
            align-items: center;
            gap: 10px;
            flex-wrap: wrap;
        }
        .attribution-item img {
            height: 10px;
            flex-shrink: 0;
        }
        .attribution-item p {
            font-size: 0.7rem;
            margin: 0;
            color: var(--text-secondary);
            line-height: 1.3;
        }
        .attribution-item a {
            color: var(--accent-color);
            text-decoration: none;
        }
        .attribution-item a:hover {
            text-decoration: underline;
        }
        @media (max-width: 480px) {
            .search-box {
                flex-direction: column;
            }
            .primary-btn {
                width: 100%;
            }
            .attribution-item {
                flex-direction: column;
                align-items: flex-start;
                gap: 5px;
            }
        }
        .hidden { display: none !important; }
        
        .episode-selection {
            margin-top: 10px;
            padding-top: 10px;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        .season-row {
            margin-bottom: 8px;
        }
        .checkbox-group {
            display: flex;
            align-items: center;
            gap: 8px;
            cursor: pointer;
            font-size: 0.9rem;
        }
        .checkbox-group input {
            width: 18px;
            height: 18px;
            cursor: pointer;
        }
    </style>
    `;

    let currentMode: 'tv' | 'movie' = 'tv';
    let selectedItems: SelectedItem[] = [];

    const modeTv = document.getElementById('mode-tv')!;
    const modeMovies = document.getElementById('mode-movies')!;
    const searchInput = document.getElementById('search-input') as HTMLInputElement;
    const searchBtn = document.getElementById('search-btn') as HTMLButtonElement;
    const moviesComingSoon = document.getElementById('movies-coming-soon') as HTMLElement;
    const resultsContainer = document.getElementById('results-container')!;
    const loadingIndicator = document.getElementById('loading-indicator')!;
    const selectionSummary = document.getElementById('selection-summary')!;
    const totalTimeEl = document.getElementById('total-time')!;
    const timeFormattedEl = document.getElementById('time-formatted')!;
    const clearBtn = document.getElementById('clear-selection')!;

    const toggleMode = (mode: 'tv' | 'movie') => {
        currentMode = mode;
        const isTv = mode === 'tv';
        modeTv.classList.toggle('active', isTv);
        modeMovies.classList.toggle('active', !isTv);

        // TV mode: enable search for TV shows
        searchInput.disabled = !isTv;
        searchBtn.disabled = !isTv;
        moviesComingSoon.classList.toggle('hidden', isTv);
        resultsContainer.innerHTML = '';
        resultsContainer.classList.add('hidden');
    };

    modeTv.addEventListener('click', () => toggleMode('tv'));
    modeMovies.addEventListener('click', () => toggleMode('movie'));

    // Initialize correct state for default mode (TV)
    toggleMode('tv');

    const search = async () => {
        const query = searchInput.value.trim();
        if (!query) return;

        resultsContainer.innerHTML = '';
        resultsContainer.classList.add('hidden');
        loadingIndicator.classList.remove('hidden');

        try {
            if (currentMode === 'tv') {
                await searchTV(query);
            } else {
                await searchMovies(query);
            }
        } catch (error) {
            console.error(error);
            resultsContainer.innerHTML = '<p class="error">Search failed. Please try again.</p>';
            resultsContainer.classList.remove('hidden');
        } finally {
            loadingIndicator.classList.add('hidden');
        }
    };

    const searchTV = async (query: string) => {
        const response = await fetch(`https://api.tvmaze.com/search/shows?q=${encodeURIComponent(query)}`);
        const data = await response.json();

        if (data.length === 0) {
            resultsContainer.innerHTML = '<p>No results found.</p>';
            resultsContainer.classList.remove('hidden');
            return;
        }

        data.forEach((item: any) => {
            const show = item.show;
            const card = document.createElement('div');
            card.className = 'result-card';
            card.innerHTML = `
                <img src="${show.image?.medium || 'https://via.placeholder.com/80x120?text=No+Image'}" class="result-image" alt="${show.name}" />
                <div class="result-info">
                    <h3>${show.name}</h3>
                    <div class="result-meta">${show.genres.join(', ')} • ${show.rating?.average || 'N/A'} ⭐</div>
                    <button class="secondary-btn load-seasons-btn" data-id="${show.id}">Load Seasons</button>
                    <div id="seasons-${show.id}" class="episode-selection hidden"></div>
                </div>
            `;

            const loadBtn = card.querySelector('.load-seasons-btn') as HTMLButtonElement;
            loadBtn.addEventListener('click', () => loadSeasons(show.id, show.name, card));

            resultsContainer.appendChild(card);
        });
        resultsContainer.classList.remove('hidden');
    };

    const loadSeasons = async (showId: number, showName: string, card: HTMLElement) => {
        const seasonsContainer = card.querySelector(`#seasons-${showId}`)!;
        if (!seasonsContainer.classList.contains('hidden')) {
            seasonsContainer.classList.add('hidden');
            return;
        }

        seasonsContainer.innerHTML = '<div class="spinner"></div>';
        seasonsContainer.classList.remove('hidden');

        try {
            const response = await fetch(`https://api.tvmaze.com/shows/${showId}/episodes`);
            const episodes = await response.json();

            // Group by season
            const seasons: Record<number, any[]> = {};
            episodes.forEach((ep: any) => {
                if (!seasons[ep.season]) seasons[ep.season] = [];
                seasons[ep.season].push(ep);
            });

            seasonsContainer.innerHTML = '';
            Object.entries(seasons).forEach(([seasonNum, seasonEpisodes]) => {
                const seasonTime = seasonEpisodes.reduce((acc, ep) => acc + (ep.runtime || 0), 0);
                const seasonRow = document.createElement('div');
                seasonRow.className = 'season-row';

                const isSelected = selectedItems.some(s => s.id === `tv-${showId}-s${seasonNum}`);

                seasonRow.innerHTML = `
                    <label class="checkbox-group">
                        <input type="checkbox" class="season-cb" data-id="tv-${showId}-s${seasonNum}" ${isSelected ? 'checked' : ''} />
                        <span>Season ${seasonNum} (${seasonEpisodes.length} eps, ${formatTime(seasonTime)})</span>
                    </label>
                `;

                const cb = seasonRow.querySelector('.season-cb') as HTMLInputElement;
                cb.addEventListener('change', () => {
                    if (cb.checked) {
                        selectedItems.push({
                            id: `tv-${showId}-s${seasonNum}`,
                            name: `${showName} - Season ${seasonNum}`,
                            duration: seasonTime,
                            type: 'tv',
                            season: parseInt(seasonNum)
                        });
                    } else {
                        selectedItems = selectedItems.filter(s => s.id !== `tv-${showId}-s${seasonNum}`);
                    }
                    updateSummary();
                });

                seasonsContainer.appendChild(seasonRow);
            });
        } catch (error) {
            seasonsContainer.innerHTML = '<p>Error loading episodes.</p>';
        }
    };

    const searchMovies = async (query: string) => {
        const response = await fetch(`/api/tmdb/search/movie?query=${encodeURIComponent(query)}`);
        const data = await response.json();

        if (data.error) {
            resultsContainer.innerHTML = `<p class="error">${data.error}. Make sure TMDB_API_KEY is set in Cloudflare secrets.</p>`;
            resultsContainer.classList.remove('hidden');
            return;
        }

        if (!data.results || data.results.length === 0) {
            resultsContainer.innerHTML = '<p>No results found.</p>';
            resultsContainer.classList.remove('hidden');
            return;
        }

        data.results.forEach((movie: any) => {
            const card = document.createElement('div');
            card.className = 'result-card';
            const isSelected = selectedItems.some(s => s.id === `movie-${movie.id}`);

            card.innerHTML = `
                <img src="${movie.poster_path ? 'https://image.tmdb.org/t/p/w200' + movie.poster_path : 'https://via.placeholder.com/80x120?text=No+Image'}" class="result-image" alt="${movie.title}" />
                <div class="result-info">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                        <h3>${movie.title}</h3>
                        <input type="checkbox" class="movie-cb" data-id="movie-${movie.id}" ${isSelected ? 'checked' : ''} />
                    </div>
                    <div class="result-meta">${movie.release_date?.split('-')[0] || 'N/A'} • ${movie.vote_average} ⭐</div>
                    <p id="runtime-${movie.id}" class="help-text">Loading runtime...</p>
                </div>
            `;

            const cb = card.querySelector('.movie-cb') as HTMLInputElement;

            // Need to fetch individual movie details to get the runtime
            fetchMovieDetails(movie.id, card, movie.title, cb);

            resultsContainer.appendChild(card);
        });
        resultsContainer.classList.remove('hidden');
    };

    const fetchMovieDetails = async (id: number, card: HTMLElement, title: string, cb: HTMLInputElement) => {
        try {
            const response = await fetch(`/api/tmdb/movie/${id}`);
            const data = await response.json();
            const runtime = data.runtime || 0;
            const runtimeEl = card.querySelector(`#runtime-${id}`)!;
            runtimeEl.textContent = `${runtime} minutes`;

            cb.addEventListener('change', () => {
                if (cb.checked) {
                    selectedItems.push({
                        id: `movie-${id}`,
                        name: title,
                        duration: runtime,
                        type: 'movie'
                    });
                } else {
                    selectedItems = selectedItems.filter(s => s.id !== `movie-${id}`);
                }
                updateSummary();
            });
        } catch (error) {
            const runtimeEl = card.querySelector(`#runtime-${id}`)!;
            runtimeEl.textContent = 'Runtime unavailable';
            cb.disabled = true;
        }
    };

    const updateSummary = () => {
        if (selectedItems.length === 0) {
            selectionSummary.classList.add('hidden');
            return;
        }

        const totalMinutes = selectedItems.reduce((acc, item) => acc + item.duration, 0);
        const totalHours = (totalMinutes / 60).toFixed(1);
        totalTimeEl.textContent = totalHours.toString();
        timeFormattedEl.textContent = formatTimeLong(totalMinutes);
        selectionSummary.classList.remove('hidden');
    };

    const formatTime = (minutes: number) => {
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        return h > 0 ? `${h}h ${m}m` : `${m}m`;
    };

    const formatTimeLong = (minutes: number) => {
        const d = Math.floor(minutes / (24 * 60));
        const remainingMinutesAfterDay = minutes % (24 * 60);
        const h = Math.floor(remainingMinutesAfterDay / 60);
        const m = remainingMinutesAfterDay % 60;

        let res = '';
        if (d > 0) res += `${d}d `;
        if (h > 0 || d > 0) res += `${h}h `;
        res += `${m}m`;
        return res;
    };

    clearBtn.addEventListener('click', () => {
        selectedItems = [];
        updateSummary();
        document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
            (cb as HTMLInputElement).checked = false;
        });
    });

    searchBtn.addEventListener('click', search);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') search();
    });
}
