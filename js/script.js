const FIREBASE_URL = "https://ground-truth-5e33f-default-rtdb.firebaseio.com/bin.json";

// Fetch LIVE data
async function fetchBinData() {
  try {
    const res = await fetch(FIREBASE_URL);
    const data = await res.json();

    console.log("🔥 LIVE:", data);

    if (!data) return;

    // 🔥 Update ONLY bin-001 (LIVE BIN)

    // Status
    const statusEl = document.getElementById("status-bin-001");
    if (statusEl) {
      statusEl.textContent = data.status;
      statusEl.className = `status-${data.status.toLowerCase()}`;
    }

    // Weight
    const weightEl = document.getElementById("weight-bin-001");
    if (weightEl) {
      weightEl.textContent = `${data.weight} kg`;
    }

    // Fill %
    const fillEl = document.getElementById("fill-bin-001");
    if (fillEl) {
      fillEl.textContent = `${data.fill}%`;
    }

  } catch (err) {
    console.error("❌ Error:", err);
  }
}

// INIT
document.addEventListener('DOMContentLoaded', () => {
  fetchBinData();

  // 🔄 Refresh every 3 sec
  setInterval(fetchBinData, 3000);
});