class Footer extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <link rel="stylesheet" href="../../footer/footer.css">
            
            <footer class="main-footer">
                <p>Copyright &copy; 2026 ALIS. All rights reserved.</p>
            </footer>
        `;
    }
}
customElements.define('custom-footer', Footer);