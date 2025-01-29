





// document.addEventListener("DOMContentLoaded", () => {
//     const searchInput = document.getElementById("search-input") as HTMLInputElement | null;
//     const resultsContainer = document.getElementById("results");

//     if (!searchInput || !resultsContainer) return;

//     const fetchResults = async (query: string) => {
//         try {
//             const res = await fetch(`http://localhost:3001/?q=${encodeURIComponent(query)}`);
//             if (!res.ok) throw new Error("Failed to fetch data");

//             const json: string[] = await res.json();
//             resultsContainer.innerHTML = `<ul><li>${json.join("</li><li>")}</li></ul>`;
//         } catch (error) {
//             console.error("Error fetching data:", error);
//             resultsContainer.innerHTML = "<p>Error loading results</p>";
//         }
//     };

    
   

//     searchInput.addEventListener("keyup", () => {
//         const query = searchInput.value.trim();
//         if (query.length > 0) {
            
//             fetchResults(query);
//         } else {
//             resultsContainer.innerHTML = "";
//         }
//     });
// });


document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("search-input") as HTMLInputElement | null;
    const resultsContainer = document.getElementById("results");

    if (!searchInput || !resultsContainer) return; // Early return if elements are not found

    // Debounce function to delay execution of fetchResults
    let debounceTimeout: number | undefined;

    const debounce = (func: Function, delay: number) => {
        return (...args: any[]) => {
            if (debounceTimeout) {
                clearTimeout(debounceTimeout); // Clear the previous timeout
            }
            debounceTimeout = setTimeout(() => func(...args), delay); // Set a new timeout
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

    // Update the results container with the fetched data
    const updateResults = (results: string[]): void => {
        if(results?.length>=1){
            resultsContainer.innerHTML = `<ul><li>${results.join("</li><li>")}</li></ul>`;  
        }else{
            resultsContainer.innerHTML = "";
        }
        
    };

    // Display an error message when data fetching fails
    const displayError = (): void => {
        resultsContainer.innerHTML = "<p>Error loading results</p>";
    };

    // Event listener for keyup to trigger fetching results with debounce
    searchInput.addEventListener("keyup", debounce(() => {
        const query = searchInput.value.trim();

        if (query.length > 0) {
            fetchResults(query); // Fetch results if query is not empty
        } else {
            clearResults(); // Clear results if query is empty
        }
    }, 300)); // 300ms debounce delay

    // Clear results container
    const clearResults = (): void => {
        resultsContainer.innerHTML = "";
    };
});
