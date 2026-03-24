document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("add-product-form");
    const nameInput = document.getElementById("new-product");
    const qtyInput = document.getElementById("new-product-qty");
    const datalist = document.getElementById("dino-shopping-results");
    const shoppingList = document.getElementById("shopping-list");

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
            const li = document.createElement("li");
            li.className = "shopping-item";

            li.innerHTML = `
                <input type="checkbox" class="check-item" title="Check">
                <span class="item-name" style="flex-grow: 1; font-weight: bold; margin-left: 10px;">
                    ${product.name} <small style="color: gray; font-weight: normal;">(${product.category})</small>
                </span>
                <input type="number" class="item-qty-edit" value="${qty}" min="0.1" step="0.1" style="width: 60px; text-align: center;">
                <span style="font-size: 14px; margin: 0 10px; color: #555;">${product.unit}</span>
                <button type="button" class="btn-delete" style="cursor: pointer;">Delete</button>
            `;

            li.querySelector(".check-item").addEventListener("change", (event) => {
                const nameSpan = li.querySelector(".item-name");
                if (event.target.checked) {
                    nameSpan.style.textDecoration = "line-through";
                    nameSpan.style.color = "#aaa";
                } else {
                    nameSpan.style.textDecoration = "none";
                    nameSpan.style.color = "inherit";
                }
            });

            li.querySelector(".btn-delete").addEventListener("click", () => li.remove());

            shoppingList.appendChild(li);

            nameInput.value = "";
            qtyInput.value = "";
            nameInput.focus();
        } else {
            alert("Please select a valid product from the catalog.");
        }
    });

    document.querySelectorAll(".shopping-item").forEach(item => {
        const deleteBtn = item.querySelector(".btn-delete");
        const checkbox = item.querySelector(".check-item");

        if(deleteBtn) {
            deleteBtn.addEventListener("click", () => item.remove());
        }
        if(checkbox) {
            checkbox.addEventListener("change", (event) => {
                const nameSpan = item.querySelector(".item-name");
                if (event.target.checked) {
                    nameSpan.style.textDecoration = "line-through";
                    nameSpan.style.color = "#aaa";
                } else {
                    nameSpan.style.textDecoration = "none";
                    nameSpan.style.color = "inherit";
                }
            });
        }
    });
});