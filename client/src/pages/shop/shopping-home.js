document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("add-product-form");
    const nameInput = document.getElementById("new-product");
    const qtyInput = document.getElementById("new-product-qty");
    const datalist = document.getElementById("dino-shopping-results");
    const shoppingListContainer = document.getElementById("shopping-list");

    let myShoppingList = JSON.parse(localStorage.getItem("alis_shopping_list")) || [];

    function saveShoppingList() {
        localStorage.setItem("alis_shopping_list", JSON.stringify(myShoppingList));
    }

    function renderShoppingList() {
        shoppingListContainer.innerHTML = "";

        myShoppingList.forEach((item, index) => {
            const li = document.createElement("li");
            li.className = "shopping-item";

            const autoBadge = item.isAuto ? `<span style="background: #ffeb3b; padding: 2px 6px; border-radius: 4px; font-size: 12px; margin-left: 10px;">Automatic</span>` : '';

            li.innerHTML = `
                <input type="checkbox" class="check-item" title="Check" ${item.checked ? 'checked' : ''}>
                <span class="item-name" style="flex-grow: 1; font-weight: bold; margin-left: 10px; ${item.checked ? 'text-decoration: line-through; color: #aaa;' : ''}">
                    ${item.name} <small style="color: gray; font-weight: normal;">(${item.category})</small>
                    ${autoBadge}
                </span>
                <input type="number" class="item-qty-edit" value="${item.qty}" min="0.1" step="0.1" style="width: 60px; text-align: center;">
                <span style="font-size: 14px; margin: 0 10px; color: #555;">${item.unit}</span>
                <button type="button" class="btn-delete" style="cursor: pointer;">Delete</button>
            `;

            li.querySelector(".check-item").addEventListener("change", (event) => {
                item.checked = event.target.checked;
                saveShoppingList();
                renderShoppingList();
            });

            li.querySelector(".item-qty-edit").addEventListener("change", (event) => {
                item.qty = event.target.value;
                saveShoppingList();
            });

            li.querySelector(".btn-delete").addEventListener("click", () => {
                myShoppingList.splice(index, 1);
                saveShoppingList();
                renderShoppingList();
            });

            shoppingListContainer.appendChild(li);
        });
    }

    renderShoppingList();

    nameInput.addEventListener("input", (e) => {
        if (!window.HiperdinoAPI) return;
        const query = e.target.value;
        const results = window.HiperdinoAPI.searchProducts(query);
        datalist.innerHTML = "";
        results.forEach(product => {
            const option = document.createElement("option");
            option.value = product.name;
            datalist.appendChild(option);
        });
    });

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const productName = nameInput.value;
        const qty = qtyInput.value;
        const product = window.HiperdinoAPI.getProductByName(productName);

        if (product) {
            myShoppingList.push({
                name: product.name,
                category: product.category,
                unit: product.unit,
                qty: qty,
                checked: false,
                isAuto: false
            });

            saveShoppingList();
            renderShoppingList();

            nameInput.value = "";
            qtyInput.value = "";
            nameInput.focus();
        } else {
            alert(" Please select a valid product from the catalog.");
        }
    });
});