document.addEventListener("DOMContentLoaded", () => {
    let allPantries = JSON.parse(localStorage.getItem("alis_pantries")) || [];
    const currentId = localStorage.getItem("currentPantryId");
    let currentPantry = allPantries.find(p => p.id === currentId);

    if (!currentPantry) {
        window.location.href = "pantries-home.html";
        return;
    }

    document.getElementById("pantry-title").textContent = currentPantry.name;
    document.getElementById("pantry-desc").textContent = currentPantry.description;

    const searchInput = document.getElementById("product-search");
    const dataList = document.getElementById("dino-results");
    const qtyInput = document.getElementById("product-qty");
    const limitInput = document.getElementById("product-limit"); // NUEVO
    const addBtn = document.getElementById("add-item-btn");
    const inventoryList = document.getElementById("inventory-list");

    function saveToMemory() {
        localStorage.setItem("alis_pantries", JSON.stringify(allPantries));
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

        currentPantry.inventory.forEach((item, index) => {
            const li = document.createElement("li");
            li.className = "inventory-item";


            if(item.qty < item.limit) {
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


            li.querySelector(".btn-minus").addEventListener("click", () => {
                item.qty = parseFloat((item.qty - 1).toFixed(1));
                if(item.qty < 0) item.qty = 0;
                saveToMemory();
                checkAndSendToShoppingList(item);
                refreshInventoryDisplay();
            });


            li.querySelector(".btn-plus").addEventListener("click", () => {
                item.qty = parseFloat((item.qty + 1).toFixed(1));
                saveToMemory();
                refreshInventoryDisplay();
            });

            li.querySelector(".btn-delete").addEventListener("click", () => {
                currentPantry.inventory.splice(index, 1);
                saveToMemory();
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
        addBtn.addEventListener("click", () => {
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

                currentPantry.inventory.push(newItem);
                saveToMemory();
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