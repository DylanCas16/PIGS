class footer extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <link rel="stylesheet" href="footer.css">
            <footer>
                Copyright © 2026
            </footer>
        `;
    }
}
customElements.define('custom-footer', footer);