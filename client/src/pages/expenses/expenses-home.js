document.addEventListener("DOMContentLoaded", async () => {
    const userId = localStorage.getItem("alis_user_uid");

    if (!userId) {
        alert("You must log in to use the expense zone.");
        window.location.href = "../login/login.html";
        return;
    }

    const form = document.getElementById("add-expense-form");
    const descInput = document.getElementById("expense-desc");
    const costInput = document.getElementById("expense-cost");
    const dateInput = document.getElementById("expense-date");
    const expensesList = document.getElementById("expenses-list");
    const totalAmountEl = document.getElementById("total-amount");


    dateInput.valueAsDate = new Date();

    let myExpenses = {};


    async function loadExpenses() {
        try {
            const response = await fetch(`http://localhost:8080/api/users/${userId}/expenses`, {
                method: "GET",
                headers: {"Content-Type": "application/json"}
            });
            const data = await response.json();
            myExpenses = data && !data.error ? data : {};
            renderExpenses();
        } catch (error) {
            console.error("Error loading expenses:", error);
        }
    }

    function renderExpenses() {
        expensesList.innerHTML = "";
        let totalMonth = 0;

        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        const sortedExpenses = Object.entries(myExpenses).sort((a, b) => new Date(b[1].date) - new Date(a[1].date));

        sortedExpenses.forEach(([id, exp]) => {
            const expDate = new Date(exp.date);
            if (expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear) {
                totalMonth += parseFloat(exp.amount);
            }

            const li = document.createElement("li");
            li.className = "expense-item";
            li.innerHTML = `
                <div class="expense-info">
                    <span class="expense-title">${exp.desc}</span>
                    <span class="expense-date-label">${exp.date}</span>
                </div>
                <div class="expense-value">
                    <span class="expense-money">${parseFloat(exp.amount).toFixed(2)} €</span>
                    <button type="button" class="btn-delete" title="Delete" style="background-color: #ff4c4c; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer;">Delete</button>
                </div>
            `;

            li.querySelector(".btn-delete").addEventListener("click", async () => {
                if (confirm(`Are you sure you want to delete the expense "${exp.desc}"?`)) {
                    try {
                        await fetch(`http://localhost:8080/api/users/${userId}/expenses/${id}`, {
                            method: "DELETE",
                            headers: {"Content-Type": "application/json"}
                        });
                        delete myExpenses[id];
                        renderExpenses();
                    } catch (error) {
                        console.error("Error deleting expense:", error);
                        alert("There was a problem deleting the expense.");
                    }
                }
            });

            expensesList.appendChild(li);
        });

        totalAmountEl.textContent = `${totalMonth.toFixed(2)} €`;
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        console.log("1. ¡Botón pulsado! Evitando recarga...");

        const newExpense = {
            desc: descInput.value.trim(),
            amount: parseFloat(costInput.value),
            date: dateInput.value
        };

        console.log("2. Datos preparados para enviar:", newExpense);

        try {
            console.log("3. Llamando al C++ en el puerto 8080...");
            const response = await fetch(`http://localhost:8080/api/users/${userId}/expenses`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(newExpense)
            });

            console.log("4. El servidor C++ respondió con código:", response.status);
            const postData = await response.json();
            console.log("5. Datos recibidos de Firebase:", postData);

            if (response.ok && postData.name) {
                myExpenses[postData.name] = newExpense;
                renderExpenses();
                descInput.value = "";
                costInput.value = "";
                descInput.focus();
                console.log("6. ¡Éxito! Gasto añadido a la lista.");
            } else {
                alert("Error del servidor. Mira la consola.");
            }
        } catch (error) {
            console.error("ERROR FATAL AL CONECTAR:", error);
            alert("No se pudo conectar con el servidor C++.");
        }
    });

    loadExpenses();
});