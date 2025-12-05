async function populateLeaderboard() {
    const tbody = document.getElementById("leaderboard-body");
    if (!tbody) return;

    tbody.innerHTML = "<tr><td colspan='5'>Loading...</td></tr>";

    let items = [];
    try {
        if (typeof fetchScores !== "function") {
            throw new Error("fetchScores() not found. Did you include api.js?");
        }

        items = await fetchScores();
    } catch (err) {
        console.error("Error loading leaderboard:", err);
        tbody.innerHTML = "<tr><td colspan='5'>Error loading scores</td></tr>";
        return;
    }

    // Map items from { id, name, price } to match score view
    const scores = items.map((it) => ({
        id: it.id,
        playerName: it.name ?? "Unknown",
        score: typeof it.price === "number" ? it.price : Number(it.price) || 0,
        level: "-", // no level stored yet
    }));

    // Sort by score descending
    scores.sort((a, b) => b.score - a.score);

    tbody.innerHTML = "";

    if (scores.length === 0) {
        tbody.innerHTML = "<tr><td colspan='5'>No scores yet. Go play!</td></tr>";
        return;
    }

    scores.slice(0, 10).forEach((row, index) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td>${row.playerName}</td>
            <td>${row.score}</td>
            <td>${row.level}</td>
            <td>
                <button class="btn-delete" data-id="${row.id}">
                    Delete
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    // Attach click handlers for delete buttons
    tbody.querySelectorAll(".btn-delete").forEach((btn) => {
        btn.addEventListener("click", async (e) => {
            const id = e.currentTarget.getAttribute("data-id");
            if (!id) return;

            const ok = confirm("Are you sure you want to delete this score?");
            if (!ok) return;

            try {
                if (typeof deleteScore !== "function") {
                    throw new Error("deleteScore() not found. Did you include api.js?");
                }
                await deleteScore(id);
                await populateLeaderboard(); // refresh list
            } catch (err) {
                console.error("Error deleting score:", err);
            }
        });
    });
}

window.addEventListener("load", populateLeaderboard);
