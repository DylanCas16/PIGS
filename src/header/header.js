class header extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <link rel="stylesheet" href="../../header/header.css">
            
            <header class="main-header">
                <h1>ALIS</h1>
                <nav>
                    <ul>
                        <li><a href="../pantries/pantries-home.html">Pantries</a></li>
                        <li><a href="../recipes/recipes-home.html">Recipes</a></li>
                         <li><a href="../shop/shopping-home.html">Shopping List</a></li>
                        <li><a href="../expenses/expenses-home.html">Expense zone</a></li>
                    </ul>
                </nav>
            </header>
        `;
    }
}
customElements.define('custom-header', header);