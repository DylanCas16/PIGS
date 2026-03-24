document.addEventListener("DOMContentLoaded", () => {
    const pantryData = JSON.parse(localStorage.getItem("currentPantry"));

  if (!pantryData) {
        window.location.href = "pantries-home.html";
        return;
    }

    document.getElementById("pantry-title").textContent = pantryData.name;
    document.getElementById("pantry-desc").textContent = pantryData.description;

    const searchInput = document.getElementById("product-search");
    const dataList = document.getElementById("dino-results");
    const qtyInput = document.getElementById("product-qty");
    const addBtn = document.getElementById("add-item-btn");
    const inventoryList = document.getElementById("inventory-list");

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

    addBtn.addEventListener("click", () => {
        const productName = searchInput.value;
        const qty = qtyInput.value;

        const product = window.HiperdinoAPI.getProductByName(productName);

        if (product) {
            const li = document.createElement("li");
            li.className = "inventory-item";
            li.innerHTML = `
                <div>
                    <strong>${product.name}</strong> 
                    <span class="item-category">${product.category}</span>
                </div>
                <div>
                    ${qty} ${product.unit} 
                    <button class="btn-delete" style="border:none; background:none; cursor:pointer; margin-left:15px;">Delete</button>
                </div>
            `;

            li.querySelector(".btn-delete").addEventListener("click", () => li.remove());

            inventoryList.appendChild(li);

            searchInput.value = "";
            qtyInput.value = "1";
        } else {
            alert("Please, select a valid product of the list.");
        }
    });
});