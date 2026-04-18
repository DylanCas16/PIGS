// ═══════════════════════════════════════════════
//  DATA — 41 tiendas organizadas por zona
// ═══════════════════════════════════════════════
const ZONAS = [
    {
        zona: 'Las Palmas de Gran Canaria', emoji: '🏙️',
        tiendas: [
            { nombre: 'HiperDino El Muelle',          lat: 28.1420501, lng: -15.4272776 },
            { nombre: 'HiperDino Luis Doreste',        lat: 28.1185603, lng: -15.4228615 },
            { nombre: 'HiperDino Triana',              lat: 28.1065200, lng: -15.4155020 },
            { nombre: 'HiperDino Escaleritas',         lat: 28.1116943, lng: -15.4397544 },
            { nombre: 'HiperDino Agustina de Aragón',  lat: 28.1094575, lng: -15.4314868 },
            { nombre: 'HiperDino Miller',              lat: 28.1029420, lng: -15.4352360 },
            { nombre: 'HiperDino 7 Palmas',            lat: 28.1063710, lng: -15.4538289 },
            { nombre: 'HiperDino CC Alisios',          lat: 28.0944885, lng: -15.4741681 },
            { nombre: 'HiperDino La Suerte',           lat: 28.0971083, lng: -15.4820045 },
            { nombre: 'HiperDino Casablanca III',      lat: 28.0928232, lng: -15.4435631 },
            { nombre: 'SuperDino Barcelona',           lat: 28.1332937, lng: -15.4337621 },
            { nombre: 'SuperDino Nicolás Estévanez',   lat: 28.1393410, lng: -15.4342957 },
            { nombre: 'SuperDino La Paterna',          lat: 28.0973826, lng: -15.4468173 },
        ]
    },
    {
        zona: 'Norte', emoji: '🌊',
        tiendas: [
            { nombre: 'HiperDino Arucas',             lat: 28.1179001, lng: -15.5287896 },
            { nombre: 'SuperDino El Mirón — Arucas',  lat: 28.1180090, lng: -15.5262121 },
            { nombre: 'SuperDino Guía',               lat: 28.1417608, lng: -15.6356844 },
            { nombre: 'HiperDino Gáldar',             lat: 28.1188261, lng: -15.6754269 },
        ]
    },
    {
        zona: 'Interior', emoji: '⛰️',
        tiendas: [
            { nombre: 'SuperDino Teror',              lat: 28.0609241, lng: -15.5467627 },
            { nombre: 'SuperDino Vega de San Mateo',  lat: 28.0110217, lng: -15.5296189 },
        ]
    },
    {
        zona: 'Telde', emoji: '🏘️',
        tiendas: [
            { nombre: 'HiperDino Melenara',           lat: 28.0041598, lng: -15.3920657 },
            { nombre: 'HiperDino Arnao',              lat: 28.0002610, lng: -15.4172825 },
            { nombre: 'SuperDino Telde',              lat: 27.9956587, lng: -15.4146891 },
        ]
    },
    {
        zona: 'Sureste', emoji: '🌾',
        tiendas: [
            { nombre: 'HiperDino Ingenio',            lat: 27.9179188, lng: -15.4316326 },
            { nombre: 'SuperDino Cruce de Arinaga',   lat: 27.8779820, lng: -15.4275500 },
            { nombre: 'HiperDino Vecindario',         lat: 27.8596790, lng: -15.4367720 },
        ]
    },
    {
        zona: 'Sur', emoji: '🌴',
        tiendas: [
            { nombre: 'HiperDino El Tablero',         lat: 27.7668376, lng: -15.6016200 },
            { nombre: 'HiperDino Bellavista',         lat: 27.7679610, lng: -15.5760524 },
            { nombre: 'SuperDino San Fernando',       lat: 27.7674900, lng: -15.5810087 },
            { nombre: 'SuperDino Sandía',             lat: 27.7562214, lng: -15.5726380 },
        ]
    },
    {
        zona: 'Playa del Inglés / Maspalomas', emoji: '🏖️',
        tiendas: [
            { nombre: 'HiperDino Express Faro 2',           lat: 27.7567480, lng: -15.5916640 },
            { nombre: 'HiperDino Express Parque Cristóbal', lat: 27.7623460, lng: -15.5806407 },
            { nombre: 'HiperDino Express Yumbo',            lat: 27.7584155, lng: -15.5779742 },
            { nombre: 'HiperDino Express El Metro',         lat: 27.7588499, lng: -15.5693961 },
            { nombre: 'HiperDino Express Kasbah',           lat: 27.7601766, lng: -15.5693451 },
            { nombre: 'HiperDino Express Águila Roja',      lat: 27.7626883, lng: -15.5655843 },
        ]
    },
];

// ═══════════════════════════════════════════════
//  MAP
// ═══════════════════════════════════════════════
const map = L.map('map', { zoomControl: false }).setView([27.97, -15.49], 10);
L.control.zoom({ position: 'bottomright' }).addTo(map);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://openstreetmap.org">OpenStreetMap</a>',
    maxZoom: 19
}).addTo(map);

// ═══════════════════════════════════════════════
//  ICONS
// ═══════════════════════════════════════════════
const greenIcon = L.divIcon({
    className: '',
    html: `<div style="width:12px;height:12px;background:#1a7a4a;border:2px solid white;border-radius:50%;box-shadow:0 1px 4px rgba(0,0,0,.3)"></div>`,
    iconSize: [12, 12], iconAnchor: [6, 6]
});

const orangeIcon = L.divIcon({
    className: '',
    html: `<div style="width:14px;height:14px;background:#e8540a;border:2px solid white;border-radius:50%;box-shadow:0 1px 6px rgba(0,0,0,.4)"></div>`,
    iconSize: [14, 14], iconAnchor: [7, 7]
});

const userIcon = L.divIcon({
    className: '',
    html: `<div style="width:14px;height:14px;background:#2563eb;border:2.5px solid white;border-radius:50%;box-shadow:0 2px 8px rgba(37,99,235,.5)"></div>`,
    iconSize: [14, 14], iconAnchor: [7, 7]
});

// ═══════════════════════════════════════════════
//  MARKERS
// ═══════════════════════════════════════════════
const allTiendas = [];

ZONAS.forEach(z => {
    z.tiendas.forEach(t => {
        t.zona = z.zona;
        t.tipo = t.nombre.startsWith('HiperDino Express') ? 'Express'
            : t.nombre.startsWith('HiperDino') ? 'HiperDino'
                : 'SuperDino';

        const m = L.marker([t.lat, t.lng], { icon: greenIcon })
            .addTo(map)
            .bindPopup(`<div class="popup-name">${t.nombre}</div><div class="popup-zone">${t.zona}</div>`);
        t.marker = m;
        allTiendas.push(t);
    });
});

// ═══════════════════════════════════════════════
//  SIDEBAR LIST
// ═══════════════════════════════════════════════
const listEl = document.getElementById('store-list');
let total = 0;

ZONAS.forEach(z => {
    const header = document.createElement('div');
    header.className = 'zone-header';
    header.innerHTML = `<span>${z.emoji} ${z.zona}</span><span class="zone-count">${z.tiendas.length}</span>`;
    listEl.appendChild(header);

    z.tiendas.forEach(t => {
        const item = document.createElement('div');
        item.className = 'store-item';
        item.innerHTML = `
      <div class="store-dot"></div>
      <div class="store-info">
        <div class="store-name">${t.nombre}</div>
        <div class="store-type">${t.tipo}</div>
      </div>
      <div class="dist-tag" style="display:none"></div>`;

        item.addEventListener('click', () => {
            setActive(t, item);
            map.setView([t.lat, t.lng], 16);
            t.marker.openPopup();
        });

        t.listItem = item;
        listEl.appendChild(item);
        total++;
    });
});

document.getElementById('stat-total').textContent = total;
document.getElementById('stat-zones').textContent = ZONAS.length;

function setActive(t, item) {
    document.querySelectorAll('.store-item').forEach(el => {
        el.classList.remove('active');
        el.querySelector('.store-dot').style.background = '#1a7a4a';
    });
    item.classList.add('active');
    item.querySelector('.store-dot').style.background = '#1a7a4a';
    item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ═══════════════════════════════════════════════
//  UTILS
// ═══════════════════════════════════════════════
function haversine(lat1, lng1, lat2, lng2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2
        + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ═══════════════════════════════════════════════
//  SEARCH
// ═══════════════════════════════════════════════
let userMarker = null, nearestLine = null, prevNearest = null;

async function buscar() {
    const query = document.getElementById('search-input').value.trim();
    if (!query) return;

    const resultEl = document.getElementById('search-result');
    const errorEl  = document.getElementById('search-error');
    const loading  = document.getElementById('loading');

    resultEl.style.display = 'none';
    errorEl.style.display  = 'none';
    loading.classList.add('show');

    try {
        const res = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query + ', Gran Canaria, España')}&format=json&limit=1`,
            { headers: { 'Accept-Language': 'es' } }
        );
        const data = await res.json();
        loading.classList.remove('show');

        if (!data.length) {
            errorEl.textContent = '⚠️ No se encontró esa ubicación. Prueba con otro nombre.';
            errorEl.style.display = 'block';
            return;
        }

        const userLat = parseFloat(data[0].lat);
        const userLng = parseFloat(data[0].lon);

        // Marcador usuario
        if (userMarker) map.removeLayer(userMarker);
        userMarker = L.marker([userLat, userLng], { icon: userIcon })
            .addTo(map)
            .bindPopup('<div style="font-family:DM Sans,sans-serif;font-size:13px;font-weight:600">📍 Tu ubicación</div>')
            .openPopup();

        // Calcular más cercano y todas las distancias
        let nearest = null, minDist = Infinity;
        allTiendas.forEach(t => {
            const d = haversine(userLat, userLng, t.lat, t.lng);
            t.dist = d;
            const tag = t.listItem.querySelector('.dist-tag');
            tag.textContent = d.toFixed(1) + ' km';
            tag.style.display = 'block';
            if (d < minDist) { minDist = d; nearest = t; }
        });

        // Resetear estilos del anterior más cercano
        if (prevNearest) {
            prevNearest.listItem.classList.remove('nearest');
            prevNearest.listItem.querySelector('.store-dot').style.background = '#1a7a4a';
            prevNearest.marker.setIcon(greenIcon);
            prevNearest.marker.bindPopup(`<div class="popup-name">${prevNearest.nombre}</div><div class="popup-zone">${prevNearest.zona}</div>`);
        }

        // Resaltar más cercano
        nearest.listItem.classList.add('nearest');
        nearest.listItem.querySelector('.store-dot').style.background = '#e8540a';
        nearest.marker.setIcon(orangeIcon);
        nearest.marker.bindPopup(`
      <div class="popup-name">${nearest.nombre}</div>
      <div class="popup-zone">${nearest.zona}</div>
      <div class="popup-nearest-badge">⭐ Más cercano · ${minDist.toFixed(1)} km</div>
    `).openPopup();
        prevNearest = nearest;

        // Línea punteada entre usuario y tienda más cercana
        if (nearestLine) map.removeLayer(nearestLine);
        nearestLine = L.polyline([[userLat, userLng], [nearest.lat, nearest.lng]], {
            color: '#e8540a', weight: 2, dashArray: '7 5', opacity: .8
        }).addTo(map);

        map.fitBounds([[userLat, userLng], [nearest.lat, nearest.lng]], { padding: [80, 80] });
        nearest.listItem.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Panel resultado
        resultEl.style.display = 'block';
        resultEl.innerHTML = `
      <strong>${nearest.nombre}</strong>
      <span class="dist-pill">${minDist.toFixed(1)} km</span><br>
      <span style="color:#6b7280">${nearest.zona} · distancia en línea recta</span>`;

        document.getElementById('stat-nearest').textContent = minDist.toFixed(1);

    } catch (e) {
        loading.classList.remove('show');
        errorEl.textContent = '⚠️ Error al conectar con el servidor de búsqueda.';
        errorEl.style.display = 'block';
    }
}

document.getElementById('search-btn').addEventListener('click', buscar);
document.getElementById('search-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') buscar();
});