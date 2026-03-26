document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("create-recipe-form");
    const ingredientsList = document.getElementById("ingredients-list");
    const addIngredientBtn = document.getElementById("add-ingredient-btn");
    const recipesGallery = document.getElementById("recipes-gallery");
    const cancelBtn = document.getElementById("btn-cancel");

    const nameInput = document.getElementById("recipe-name");
    const timeInput = document.getElementById("prep-time");
    const portionsInput = document.getElementById("portions");
    const processInput = document.getElementById("recipe-process");

    const formTitle = document.getElementById("form-title");
    const submitBtn = document.getElementById("btn-submit");


    let myRecipes = JSON.parse(localStorage.getItem("alis_recipes")) || [];
    let editingRecipeId = null;



    function addIngredientRow(name = "", qty = "", unit = "gr") {
        const row = document.createElement("div");
        row.className = "ingredient-row form-row";
        row.style.marginBottom = "10px";

        row.innerHTML = `
            <input type="text" class="ing-name" list="dino-ingredients-results" placeholder="Ingredient" value="${name}" required style="flex: 2;">
            <input type="number" class="ing-qty" placeholder="Qty" min="0.1" step="0.1" value="${qty}" required style="flex: 1;">
            <select class="ing-unit" style="flex: 1;">
                <option value="gr" ${unit === 'gr' ? 'selected' : ''}>Grams (g)</option>
                <option value="kg" ${unit === 'kg' ? 'selected' : ''}>Kilograms (kg)</option>
                <option value="ml" ${unit === 'ml' ? 'selected' : ''}>Milliliters (ml)</option>
                <option value="l" ${unit === 'l' ? 'selected' : ''}>Liters (l)</option>
                <option value="ud" ${unit === 'ud' ? 'selected' : ''}>Units</option>
            </select>
            <button type="button" class="btn-remove-ing">X</button>
        `;

        row.querySelector(".btn-remove-ing").addEventListener("click", () => row.remove());
        const ingNameInput = row.querySelector(".ing-name");
        const ingUnitSelect = row.querySelector(".ing-unit");
        const datalist = document.getElementById("dino-ingredients-results");

        if (datalist) {
            ingNameInput.addEventListener("input", (e) => {
                if (!window.HiperdinoAPI) return;

                const query = e.target.value;
                const results = window.HiperdinoAPI.searchProducts(query);

                datalist.innerHTML = "";

                results.forEach(product => {
                    const option = document.createElement("option");
                    option.value = product.name;
                    datalist.appendChild(option);
                });

                const exactProduct = window.HiperdinoAPI.getProductByName(query);
                if (exactProduct) {
                    ingUnitSelect.value = exactProduct.unit;
                }
            });
        }

        ingredientsList.appendChild(row);
    }


    addIngredientBtn.addEventListener("click", () => addIngredientRow());
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const ingredientRows = document.querySelectorAll(".ingredient-row");
        const recipeIngredients = [];
        ingredientRows.forEach(row => {
            recipeIngredients.push({
                name: row.querySelector(".ing-name").value,
                qty: row.querySelector(".ing-qty").value,
                unit: row.querySelector(".ing-unit").value
            });
        });

        const recipeData = {
            id: editingRecipeId || "recipe_" + Date.now(),
            name: nameInput.value,
            time: timeInput.value,
            portions: portionsInput.value,
            process: processInput.value,
            ingredients: recipeIngredients
        };

        if (editingRecipeId) {
            const index = myRecipes.findIndex(r => r.id === editingRecipeId);
            myRecipes[index] = recipeData;
        } else {
            myRecipes.push(recipeData);
        }


        localStorage.setItem("alis_recipes", JSON.stringify(myRecipes));

        resetForm();
        renderGallery();
    });

    function renderGallery() {
        recipesGallery.innerHTML = "";

        myRecipes.forEach(recipe => {
            const card = document.createElement("div");
            card.className = "recipe-card";
            card.innerHTML = `
                <h3>${recipe.name}</h3>
                <p>Time: ${recipe.time || '?'} min</p>
                <p>Servings: ${recipe.portions || '?'}</p>
                <p>Ingredients: ${recipe.ingredients.length}</p>
            `;

            card.addEventListener("click", () => {
                loadRecipeIntoForm(recipe);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });

            recipesGallery.appendChild(card);
        });
    }

    function loadRecipeIntoForm(recipe) {
        editingRecipeId = recipe.id;
        formTitle.textContent = "Edit Recipe: " + recipe.name;
        submitBtn.textContent = "Update Recipe";
        submitBtn.style.backgroundColor = "#f39c12";
        nameInput.value = recipe.name;
        timeInput.value = recipe.time;
        portionsInput.value = recipe.portions;
        processInput.value = recipe.process;
        ingredientsList.innerHTML = "";
        recipe.ingredients.forEach(ing => {
            addIngredientRow(ing.name, ing.qty, ing.unit);
        });
    }

    function resetForm() {
        form.reset();
        ingredientsList.innerHTML = "";
        addIngredientRow();

        editingRecipeId = null;
        formTitle.textContent = "Create a new recipe";
        submitBtn.textContent = "Save Recipe";
        submitBtn.style.backgroundColor = "#4CAF50";
    }

    cancelBtn.addEventListener("click", resetForm);
    renderGallery();
    if(ingredientsList.children.length === 0) {
        addIngredientRow();
    }
});