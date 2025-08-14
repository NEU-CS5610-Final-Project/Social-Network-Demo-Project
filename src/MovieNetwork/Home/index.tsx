import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { searchMovies, getPosterUrl, type MovieSearchResult } from "../Search/client";
import TrendingNow from "./TrendingMovies/TrendingNow";
import LatestReview from "./LatestReview/LatestReview";

export default function Home() {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchedQuery, setSearchedQuery] = useState(""); // Store the actual searched query
    const [searchResults, setSearchResults] = useState<MovieSearchResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [searchError, setSearchError] = useState<string | null>(null);
    const [hasSearched, setHasSearched] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalResults, setTotalResults] = useState(0);
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    // Initialize search state from URL params when component mounts
    useEffect(() => {
        const queryFromUrl = searchParams.get('q');
        const pageFromUrl = searchParams.get('page');

        if (queryFromUrl) {
            setSearchQuery(queryFromUrl);
            setSearchedQuery(queryFromUrl); // Set the searched query as well
            setHasSearched(true);
            const page = pageFromUrl ? parseInt(pageFromUrl) : 1;
            setCurrentPage(page);
            // Perform the search automatically
            performSearch(queryFromUrl, page);
        }
    }, []);

    const performSearch = async (query: string, page: number = 1) => {
        setIsSearching(true);
        setSearchError(null);
        setHasSearched(true);
        setCurrentPage(page);
        setSearchedQuery(query); // Update the searched query when performing search

        try {
            const results = await searchMovies(query.trim(), page);
            setSearchResults(results.results);
            setTotalPages(results.total_pages);
            setTotalResults(results.total_results);
        } catch (error) {
            setSearchError("Search failed, please try again later");
            setSearchResults([]);
            setTotalPages(1);
            setTotalResults(0);
        } finally {
            setIsSearching(false);
        }
    };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!searchQuery.trim()) {
            setSearchError("Please enter a search keyword");
            return;
        }

        // Update URL with search query
        setSearchParams({ q: searchQuery.trim(), page: '1' });

        // Perform the search
        await performSearch(searchQuery.trim(), 1);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSearch(e);
        }
    };

    const handlePageChange = async (newPage: number) => {
        if (newPage < 1 || newPage > totalPages) return;

        // Update URL with new page
        setSearchParams({ q: searchedQuery, page: newPage.toString() });

        // Perform search for new page
        await performSearch(searchedQuery, newPage);

        // Scroll to top of results
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleMovieClick = (movieId: number) => {
        // Navigate to movie details while preserving search state
        // For hash routing, we need to include the hash part
        const currentPath = window.location.pathname;
        const currentSearch = window.location.search;
        const currentHash = window.location.hash;
        const returnPath = currentPath + currentSearch + currentHash;

        console.log("Saving return path:", returnPath);
        navigate(`/movie/${movieId}?returnTo=${encodeURIComponent(returnPath)}`);
    };

    const clearSearch = () => {
        setSearchQuery("");
        setSearchedQuery("");
        setSearchResults([]);
        setHasSearched(false);
        setSearchError(null);
        setCurrentPage(1);
        setTotalPages(1);
        setTotalResults(0);
        setSearchParams({});
    };

    return (
        <div>
            {/* Main Content */}
            <main className="py-5">
                <div className="container">
                    {/* Search Section */}
                    <section className="mb-5 text-center">
                        <form onSubmit={handleSearch} className="row justify-content-center">
                            <div className="col-md-6">
                                <div className="input-group">
                                    <input
                                        type="text"
                                        className="form-control form-control-lg"
                                        placeholder="Search movies..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        disabled={isSearching}
                                    />
                                    <button
                                        type="submit"
                                        className="btn btn-primary btn-lg"
                                        disabled={isSearching}
                                    >
                                        {isSearching ? "Searching..." : "Search"}
                                    </button>
                                    {hasSearched && (
                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary"
                                            onClick={clearSearch}
                                        >
                                            Clear
                                        </button>
                                    )}
                                </div>
                                {searchError && (
                                    <div className="text-danger mt-2">
                                        {searchError}
                                    </div>
                                )}
                            </div>
                        </form>
                    </section>

                    {/* Search Results Section */}
                    {hasSearched && (
                        <section className="mb-5">
                            <h2 className="text-center mb-4">
                                {isSearching ? "Searching..." : `Search Results for "${searchedQuery}" (${totalResults} movies found)`}
                            </h2>

                            {!isSearching && searchResults.length === 0 && !searchError && (
                                <div className="text-center text-muted">
                                    <p>No movies found for "{searchedQuery}", please try different keywords</p>
                                </div>
                            )}

                            {searchResults.length > 0 && (
                                <>
                                    <div className="row g-4">
                                        {searchResults.map((movie) => (
                                            <div key={movie.id} className="col-md-6 col-lg-3">
                                                <div
                                                    className="card movie-card h-100"
                                                    onClick={() => handleMovieClick(movie.id)}
                                                    style={{ cursor: 'pointer' }}
                                                >
                                                    {movie.poster_path ? (
                                                        <img
                                                            src={getPosterUrl(movie.poster_path)}
                                                            alt={movie.title}
                                                            className="card-img-top movie-poster"
                                                            style={{ height: "300px", objectFit: "cover" }}
                                                            onError={(e) => {
                                                                const target = e.target as HTMLImageElement;
                                                                target.src = "/avatar/default.png";
                                                            }}
                                                        />
                                                    ) : (
                                                        <div
                                                            className="card-img-top d-flex align-items-center justify-content-center"
                                                            style={{
                                                                height: "300px",
                                                                backgroundColor: "#f8f9fa",
                                                                color: "#6c757d",
                                                                fontSize: "1.2rem",
                                                                fontWeight: "500"
                                                            }}
                                                        >
                                                            No Image
                                                        </div>
                                                    )}
                                                    <div className="card-body">
                                                        <h5 className="card-title">{movie.title}</h5>
                                                        <p className="card-text text-muted">
                                                            Release Date: {movie.release_date && movie.release_date.trim() !== "" ? new Date(movie.release_date).toLocaleDateString('en-US') : 'Unknown'}
                                                        </p>
                                                        <p className="card-text small">
                                                            Rating: {movie.vote_average !== null && movie.vote_average !== undefined ? movie.vote_average.toFixed(1) : 'N/A'} ⭐ ({movie.vote_count !== null && movie.vote_count !== undefined ? movie.vote_count : 'N/A'} votes)
                                                        </p>
                                                        <p className="card-text small text-truncate">
                                                            {movie.overview || 'No overview available'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Pagination */}
                                    {totalPages > 1 && (
                                        <div className="d-flex justify-content-center mt-5">
                                            <nav aria-label="Search results pagination">
                                                <ul className="pagination">
                                                    {/* Previous button */}
                                                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                                        <button
                                                            className="page-link"
                                                            onClick={() => handlePageChange(currentPage - 1)}
                                                            disabled={currentPage === 1}
                                                        >
                                                            Previous
                                                        </button>
                                                    </li>

                                                    {/* Page numbers */}
                                                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                                        let pageNum;
                                                        if (totalPages <= 5) {
                                                            pageNum = i + 1;
                                                        } else if (currentPage <= 3) {
                                                            pageNum = i + 1;
                                                        } else if (currentPage >= totalPages - 2) {
                                                            pageNum = totalPages - 4 + i;
                                                        } else {
                                                            pageNum = currentPage - 2 + i;
                                                        }

                                                        return (
                                                            <li key={pageNum} className={`page-item ${currentPage === pageNum ? 'active' : ''}`}>
                                                                <button
                                                                    className="page-link"
                                                                    onClick={() => handlePageChange(pageNum)}
                                                                >
                                                                    {pageNum}
                                                                </button>
                                                            </li>
                                                        );
                                                    })}

                                                    {/* Next button */}
                                                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                                        <button
                                                            className="page-link"
                                                            onClick={() => handlePageChange(currentPage + 1)}
                                                            disabled={currentPage === totalPages}
                                                        >
                                                            Next
                                                        </button>
                                                    </li>
                                                </ul>
                                            </nav>
                                        </div>
                                    )}

                                    {/* Page info */}
                                    <div className="text-center text-muted mt-3">
                                        <small>
                                            Showing page {currentPage} of {totalPages}
                                            ({searchResults.length} movies per page)
                                        </small>
                                    </div>
                                </>
                            )}
                        </section>
                    )}

                    {/* Latest Movies Section - Only show when not searching */}
                    {!hasSearched && (
                        < section >
                            <h2 className="text-center mb-4">Latest Movies</h2>
                            <TrendingNow />
                            <LatestReview limit={5} />
                        </section>
                    )}
                </div>
            </main>
        </div>
    );
}