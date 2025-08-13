import { useState } from "react";
import TrendingNow from "./TrendingNow";
// import TestLatestMovies from "./TestTestLatestMovies";

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
                        <h2 className="text-center mb-4">Popular Movies</h2>
                        <TrendingNow />
                    </section>
                </div>
            </main>
        </div>
    );
}