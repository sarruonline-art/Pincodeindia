let map;

async function searchPincode() {
    const pincode = document.getElementById("pincode").value.trim();
    const resultDiv = document.getElementById("result");

    if (!/^[1-9][0-9]{5}$/.test(pincode)) {
        resultDiv.innerHTML = "❌ Enter valid Indian pincode";
        return;
    }

    resultDiv.innerHTML = "🔍 Searching...";

    const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
    const data = await response.json();

    if (data[0].Status !== "Success") {
        resultDiv.innerHTML = "❌ Pincode not found";
        return;
    }

    const po = data[0].PostOffice[0];

    resultDiv.innerHTML = `
        <h3>Pincode: ${pincode}</h3>
        <p><b>Post Office:</b> ${po.Name}</p>
        <p><b>District:</b> ${po.District}</p>
        <p><b>State:</b> ${po.State}</p>
    `;

    loadMap(`${po.Name}, ${po.District}, ${po.State}`);
}

async function loadMap(address) {
    const geo = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${address}`);
    const loc = await geo.json();

    if (loc.length === 0) return;

    const lat = loc[0].lat;
    const lon = loc[0].lon;

    if (map) map.remove();

    map = L.map('map').setView([lat, lon], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
    L.marker([lat, lon]).addTo(map);
}
