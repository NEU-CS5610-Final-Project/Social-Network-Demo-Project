// TestTestLatestMovies.tsx

import { useEffect } from "react";
import { getLatestMovies } from "./Client";

export default function TestLatestMovies() {
    useEffect(() => {
      (async () => {
        const movies = await getLatestMovies();
        console.log("Latest Movies:", movies); // 打印看看
      })();
    }, []);
  
    return <div>Check console for latest movies</div>;
  }