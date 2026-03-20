class header extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <link rel="stylesheet" href="header.css">
            <header>
                <nav>
                    <a href="index.html">Home</a>
                    <a href="#">Login</a>
                    <a href="#">Register</a>
                </nav>
            </header>
        `;
    }
}
customElements.define('custom-header', header);