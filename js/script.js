const FIREBASE_URL = "https://ground-truth-5e33f-default-rtdb.firebaseio.com/bin-001.json";

// Global live data store
let liveBinData = {};

// Fetch LIVE data
async function fetchBinData() {
  try {
    const res = await fetch(FIREBASE_URL);
    const data = await res.json();

    console.log("🔥 LIVE:", data);

    liveBinData = data || {};
    updateDashboard(liveBinData);

  } catch (err) {
    console.error("❌ Error:", err);
    liveBinData = {};
    updateDashboard(liveBinData);
  }
}

function updateDashboard(data) {
  const status = data.status || 'No Data';
  const fill = data.fillPercentage || data.fill || '--';
  const weight = data.weight || '--';
  const statusClass = data.status ? `status-${data.status.toLowerCase()}` : 'status-unknown';

  // Update Mysuru Palace card (bin-002)
  const statusEl = document.getElementById("status-bin-001");
  if (statusEl) {
    statusEl.textContent = status;
    statusEl.className = statusClass;
  }

  const weightEl = document.getElementById("weight-bin-001");
  if (weightEl) {
    weightEl.textContent = `${weight} kg`;
  }

  const fillEl = document.getElementById("fill-bin-001");
  if (fillEl) {
    fillEl.textContent = `${fill}%`;
  }

  // Update details page (Mysuru Palace inner dashboard)
  const detailsStatusEl = document.getElementById("dustbin-status");
  if (detailsStatusEl) {
    detailsStatusEl.textContent = status;
    detailsStatusEl.className = statusClass;
  }

  const detailsWeightEl = document.getElementById("fill-level-value");
  if (detailsWeightEl) {
    detailsWeightEl.textContent = weight;
  }

  const detailsFillTextEl = document.querySelector(".fill-level-text");
  if (detailsFillTextEl) {
    detailsFillTextEl.textContent = `${fill}%`;
  }

  const progressBarEl = document.getElementById("progress-bar-inner");
  if (progressBarEl) {
    const fillNum = typeof fill === "number" ? fill : 0;
    progressBarEl.style.width = `${fillNum}%`;
    // Add status class for styling
    if (data.status) {
      progressBarEl.classList.remove("status-low", "status-medium", "status-high", "status-full");
      progressBarEl.classList.add(`status-${data.status.toLowerCase()}`);
    }
  }



// INIT
document.addEventListener('DOMContentLoaded', () => {
  fetchBinData();

  // 🔄 Refresh every 6 sec
  setInterval(fetchBinData, 6000);
});