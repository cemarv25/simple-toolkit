import template from './template.html?raw';
import './style.css';

type SelectedItem = {
    id: string;
    name: string;
    duration: number; // in minutes
    type: 'tv' | 'movie';
    season?: number;
    episode?: number;
};

export function render(container: HTMLElement) {
    let currentMode: 'tv' | 'movie' = 'tv';
    let selectedItems: SelectedItem[] = [];

    container.innerHTML = template;

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

        searchInput.disabled = !isTv;
        searchBtn.disabled = !isTv;
        moviesComingSoon.classList.toggle('hidden', isTv);
        resultsContainer.innerHTML = '';
        resultsContainer.classList.add('hidden');
    };

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

    toggleMode('tv');
}

