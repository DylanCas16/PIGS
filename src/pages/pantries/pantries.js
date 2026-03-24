document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("create-supply-list-form");
    const listNameInput = document.getElementById("list-name");
    const listDescInput = document.getElementById("list-desc");
    const pantriesListContainer = document.getElementById("pantries-list");

    let myPantries = [];

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = listNameInput.value.trim();
        const desc = listDescInput.value.trim();

        if (name) {
            const newPantry = {
                id: "pantry_" + Date.now(),
                name: name,
                description: desc || "No description provided."
            };
            myPantries.push(newPantry);
            renderPantryCard(newPantry);
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
        `;


        card.addEventListener("click", () => {
            localStorage.setItem("currentPantry", JSON.stringify(pantry));
            window.location.href = "pantry-details.html";
        });
        pantriesListContainer.appendChild(card);
    }
});