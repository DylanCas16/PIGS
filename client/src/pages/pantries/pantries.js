document.addEventListener("DOMContentLoaded", async () => {
    const form = document.getElementById("create-supply-list-form");
    const listNameInput = document.getElementById("list-name");
    const listDescInput = document.getElementById("list-desc");
    const pantriesListContainer = document.getElementById("pantries-list");

    const response = await fetch("http://localhost:8080/api/supplies", {
        method: "GET",
        headers: {"Content-Type": "application/json"}
    });
    const myPantries = await response.json();
    if (myPantries) {
        Object.entries(myPantries).forEach(([id, data]) => renderPantryCard({...data, id: id}));
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const name = listNameInput.value.trim();
        const desc = listDescInput.value.trim();

        if (name) {
            const newPantry = {
                name: name,
                description: desc || "Without description.",
                inventory: []
            };
            const response = await fetch("http://localhost:8080/api/supplies", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(newPantry)
            });
            const data = await response.json();
            renderPantryCard({...newPantry, id: data.name});
            form.reset();
            listNameInput.focus();
        }
    });

    function renderPantryCard(pantry) {
        const card = document.createElement("div");
        card.className = "pantry-card";
        card.innerHTML = `
            <h3>${pantry.name}</h3>
            <p>${pantry.description}</p>
            <button class="btn-delete" title="Delete pantry"`;

        card.addEventListener("click", () => {
            localStorage.setItem("currentPantryId", pantry.id);
            window.location.href = "pantry-details.html";
        });
        card.querySelector(".btn-delete").addEventListener("click", (e) => {
            e.stopPropagation();
            deletePantry(pantry.id);
        });
        pantriesListContainer.appendChild(card);
    }

    async function deletePantry(pantryId) {
        const response = await fetch("http://localhost:8080/api/supplies/" + pantryId, {
            method: "DELETE",
            headers: {"Content-Type": "application/json"}
        })
        return response.json();
    }
});