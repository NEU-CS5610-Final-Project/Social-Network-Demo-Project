import { useState } from "react";

export default function Home() {
    const [searchQuery, setSearchQuery] = useState("");
    return (
        <div>
            {/* Main Content */}
            <main className="py-5">
                <div className="container">
                    {/* Search Section */}
                    <section className="mb-5 text-center">
                        <form className="row justify-content-center">
                            <div className="col-md-6">
                                <div className="input-group">
                                    <input
                                        type="text"
                                        className="form-control form-control-lg"
                                        placeholder="Search movie..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                    <button className="btn btn-primary btn-lg"> {/*TODO: Implement search functionality*/}
                                        Search
                                    </button>
                                </div>
                            </div>
                        </form>
                    </section>

                    {/* Latest Movies Section */}
                    <section>
                        <h2 className="text-center mb-4">Latest Movies</h2>
                        <div className="row g-4"> {/*TODO: Implement latest movies fetching*/}
                            {/*latestMovies.map((movie) => (
                                <div key={movie.id} className="col-md-6 col-lg-3">
                                    <div className="card movie-card h-100">
                                        <img
                                            src={movie.poster}
                                            alt={movie.title}
                                            className="card-img-top movie-poster"
                                        />
                                        <div className="card-body">
                                            <h5 className="card-title">{movie.title}</h5>
                                            <p className="card-text text-muted">
                                                Release Date: {new Date(movie.releaseDate).toLocaleDateString()}
                                            </p>
                                            <p className="card-text small">
                                                Cast: {movie.cast.join(', ')}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))*/}
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}