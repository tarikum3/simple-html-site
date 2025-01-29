


document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("search-input") as HTMLInputElement | null;
    const resultsContainer = document.getElementById("results");

    if (!searchInput || !resultsContainer) return; 

    const debounce = (func: (...args: any[]) => void, delay: number) => {
        let debounceTimeout: number | undefined; 
        return (...args: any[]) => {
            if (debounceTimeout) {
                clearTimeout(debounceTimeout);
            }
            debounceTimeout = window.setTimeout(() => func(...args), delay);
        };
    };

    // Function to fetch search results
    const fetchResults = async (query: string): Promise<void> => {
        try {
            const res = await fetch(`http://localhost:3001/?q=${encodeURIComponent(query)}`);
            if (!res.ok) throw new Error("Failed to fetch data");

            const json: string[] = await res.json();
            updateResults(json);
        } catch (error) {
            console.error("Error fetching data:", error);
            displayError();
        }
    };

    // Update the results container with the fetched data safely
    const updateResults = (results: string[]): void => {
        resultsContainer.innerHTML = ""; // Clear previous results

        if (results.length > 0) {
            const ul = document.createElement("ul");
            results.forEach(result => {
                const li = document.createElement("li");
                li.textContent = result; // Avoids innerHTML for security
                ul.appendChild(li);
            });
            resultsContainer.appendChild(ul);
        }
    };

    // Display an error message when data fetching fails
    const displayError = (): void => {
        resultsContainer.innerHTML = "<p>Error loading results</p>";
    };

    searchInput.addEventListener("keyup", debounce(() => {
        const query = searchInput.value.trim();

        if (query.length > 0) {
            fetchResults(query); 
        } else {
            clearResults(); 
        }
    }, 300)); 

    const clearResults = (): void => {
        resultsContainer.innerHTML = "";
    };
});
