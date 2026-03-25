document.addEventListener("DOMContentLoaded", async () => {
    const currentId = localStorage.getItem("currentPantryId");

    if (!currentId) {
        window.location.href = "pantries-home.html";
        return;
    }

    const response = await fetch("http://localhost:8080/api/supplies/" + currentId, {
        method: "GET",
        headers: {"Content-Type": "application/json"}
    });
    const data = await response.json();

    if (!data) {
        window.location.href = "pantries-home.html";
        return;
    }

    let currentPantry = {
        ...data,
        id: currentId,
        inventory: data.items
            ? Object.entries(data.items).map(([id, item]) => ({ ...item, id }))
            : []
    };

    document.getElementById("pantry-title").textContent = currentPantry.name;
    document.getElementById("pantry-desc").textContent = currentPantry.description;

    const searchInput = document.getElementById("product-search");
    const dataList = document.getElementById("dino-results");
    const qtyInput = document.getElementById("product-qty");
    const limitInput = document.getElementById("product-limit");
    const addBtn = document.getElementById("add-item-btn");
    const inventoryList = document.getElementById("inventory-list");

    async function saveToMemory(item) {
        await fetch("http://localhost:8080/api/supplies/" + currentId + "/items/" + item.id, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(item)
        });
    }

    function checkAndSendToShoppingList(item) {
        if (item.qty < item.limit) {
            let shoppingList = JSON.parse(localStorage.getItem("alis_shopping_list")) || [];
            const alreadyInList = shoppingList.find(p => p.name === item.name);
            if (!alreadyInList) {
                shoppingList.push({
                    name: item.name,
                    category: item.category,
                    unit: item.unit,
                    qty: 1,
                    isAuto: true
                });
                localStorage.setItem("alis_shopping_list", JSON.stringify(shoppingList));
                alert(`Stock less than ${item.name}. Now its in the shopping list`);
            }
        }
    }

    function refreshInventoryDisplay() {
        inventoryList.innerHTML = "";

        currentPantry.inventory.forEach((item) => {
            const li = document.createElement("li");
            li.className = "inventory-item";

            if (item.qty < item.limit) {
                li.style.backgroundColor = "#fff3f3";
                li.style.borderLeft = "4px solid #ff4c4c";
            }

            li.innerHTML = `
                <div>
                    <strong>${item.name}</strong>
                    <span class="item-category" style="font-size: 12px; color: white; background: #2c3e50; padding: 3px 8px; border-radius: 10px; margin-left: 10px;">${item.category}</span>
                    <br><small style="color:gray;">Límite mínimo: ${item.limit}</small>
                </div>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <button class="btn-minus" style="padding: 2px 8px; cursor: pointer;">-</button>
                    <strong style="font-size: 16px;">${item.qty}</strong> ${item.unit}
                    <button class="btn-plus" style="padding: 2px 8px; cursor: pointer;">+</button>
                    <button class="btn-delete" style="border:none; background:none; cursor:pointer; margin-left:15px; font-size: 16px;" title="Delete producto">Delete</button>
                </div>
            `;

            li.querySelector(".btn-minus").addEventListener("click", async () => {
                const idx = currentPantry.inventory.findIndex(i => i.id === item.id);
                currentPantry.inventory[idx].qty = parseFloat((currentPantry.inventory[idx].qty - 1).toFixed(1));
                if (currentPantry.inventory[idx].qty < 0) currentPantry.inventory[idx].qty = 0;
                await saveToMemory(currentPantry.inventory[idx]);
                checkAndSendToShoppingList(currentPantry.inventory[idx]);
                refreshInventoryDisplay();
            });

            li.querySelector(".btn-plus").addEventListener("click", async () => {
                const idx = currentPantry.inventory.findIndex(i => i.id === item.id);
                currentPantry.inventory[idx].qty = parseFloat((currentPantry.inventory[idx].qty + 1).toFixed(1));
                await saveToMemory(currentPantry.inventory[idx]);
                refreshInventoryDisplay();
            });

            li.querySelector(".btn-delete").addEventListener("click", async () => {
                await fetch("http://localhost:8080/api/supplies/" + currentId + "/items/" + item.id, {
                    method: "DELETE",
                    headers: {"Content-Type": "application/json"}
                });
                currentPantry.inventory = currentPantry.inventory.filter(i => i.id !== item.id);
                refreshInventoryDisplay();
            });

            inventoryList.appendChild(li);
        });
    }

    refreshInventoryDisplay();

    if (searchInput && window.HiperdinoAPI) {
        searchInput.addEventListener("input", (e) => {
            const query = e.target.value;
            const results = window.HiperdinoAPI.searchProducts(query);
            dataList.innerHTML = "";
            results.forEach(product => {
                const option = document.createElement("option");
                option.value = product.name;
                dataList.appendChild(option);
            });
        });
    }

    if (addBtn && window.HiperdinoAPI) {
        addBtn.addEventListener("click", async () => {
            const productName = searchInput.value;
            const qty = parseFloat(qtyInput.value);
            const limit = parseFloat(limitInput.value);
            const product = window.HiperdinoAPI.getProductByName(productName);

            if (product) {
                const newItem = {
                    name: product.name,
                    category: product.category,
                    unit: product.unit,
                    qty: qty,
                    limit: limit
                };

                const postResponse = await fetch("http://localhost:8080/api/supplies/" + currentId + "/items/", {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(newItem)
                });
                const postData = await postResponse.json();
                currentPantry.inventory.push({ ...newItem, id: postData.name });
                checkAndSendToShoppingList(newItem);
                refreshInventoryDisplay();

                searchInput.value = "";
                qtyInput.value = "1";
                limitInput.value = "1";
            } else {
                alert("Please, select a valid product of the list.");
            }
        });
    }
});