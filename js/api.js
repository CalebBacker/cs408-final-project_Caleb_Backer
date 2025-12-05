const API_BASE_URL = "https://0edqok25n7.execute-api.us-east-2.amazonaws.com";

/**
 * Submit a new score to AWS
 * Uses PUT /items with body: { id, name, price }
 * - name  = player name
 * - price = score
 */
async function submitScore(playerName, score) {
    const item = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        name: playerName,
        price: score,
    };

    try {
        const res = await fetch(`${API_BASE_URL}/items`, {
            method: "PUT", // IMPORTANT: your Lambda is "PUT /items"
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(item),
        });

        if (!res.ok) {
            console.error("Failed to submit score:", res.status, await res.text());
        }
    } catch (err) {
        console.error("Error submitting score:", err);
    }
}

/**
 * Fetch scores from AWS
 * GET /items returns an array
 */
async function fetchScores() {
    try {
        const res = await fetch(`${API_BASE_URL}/items`);
        if (!res.ok) {
            console.error("Failed to fetch scores:", res.status, await res.text());
            return [];
        }

        const data = await res.json();

        if (!Array.isArray(data)) {
            console.warn("Unexpected response shape from /items:", data);
            return [];
        }

        return data;
    } catch (err) {
        console.error("Error fetching scores:", err);
        return [];
    }
}

async function deleteScore(id) {
    try {
        const res = await fetch(`${API_BASE_URL}/items/${encodeURIComponent(id)}`, {
            method: "DELETE",
        });

        if (!res.ok) {
            console.error("Failed to delete score:", res.status, await res.text());
        }
    } catch (err) {
        console.error("Error deleting score:", err);
    }
}


// Expose globally
window.submitScore = submitScore;
window.fetchScores = fetchScores;
window.deleteScore = deleteScore;
