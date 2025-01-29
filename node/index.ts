
import express, { Request, Response } from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

interface Comment {
    name: string;
    body: string;
}

let cachedData: Comment[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Root route with query filtering and caching
app.get("/", async (req: Request, res: Response) => {
    try {
        const currentTime = Date.now();
        if (!cachedData || currentTime - cacheTimestamp > CACHE_DURATION) {
            const response = await fetch("https://jsonplaceholder.typicode.com/comments?postId=3");
            if (!response.ok) throw new Error("Failed to fetch comments");
            
            cachedData = await response.json() as any ;
            cacheTimestamp = currentTime;
        }

        const query = (req.query.q as string || "").toLowerCase();
        
        const filteredComments = cachedData
            ?.filter(comment => comment.name.toLowerCase().includes(query))
            .map(comment => comment.name);
        
        res.json(filteredComments);
    } catch (error) {
        res.status(500).json({ error: "Error fetching comments" });
    }
});


app.listen(3001, () => {
    console.log("Server is running on port 3001");
});
