const DINO_DATABASE = [
    { id: "HD001", name: "Plátano de Canarias", category: "Fruit shop", price: 1.99, unit: "kg" },
    { id: "HD002", name: "Leche Entera Millac 1L", category: "Dairy", price: 1.15, unit: "ud" },
    { id: "HD003", name: "Leche Semidesnatada Millac 1L", category: "Dairy", price: 1.15, unit: "ud" },
    { id: "HD004", name: "Pan de Molde Bimbo", category: "Bakery", price: 2.30, unit: "ud" },
    { id: "HD005", name: "Pechuga de Pollo", category: "Butcher", price: 6.50, unit: "kg" },
    { id: "HD006", name: "Huevos Clase M (Dozen)", category: "Pantry", price: 2.10, unit: "ud" },
    { id: "HD007", name: "Agua Fuente Alta 1.5L", category: "Drinks", price: 0.60, unit: "ud" },
    { id: "HD008", name: "Queso Tierno Montesdeoca", category: "Charcuterie", price: 9.90, unit: "kg" }
];

window.HiperdinoAPI = {
    searchProducts: function(query) {
        if (!query || query.length === 0) return [];
        const lowerQuery = query.toLowerCase();
        return DINO_DATABASE.filter(product =>
            product.name.toLowerCase().includes(lowerQuery)
        );
    },

    getProductByName: function(name) {
        return DINO_DATABASE.find(product => product.name === name) || null;
    }
};


