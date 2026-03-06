// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAWHDSkFJRflliW3LXuKAbNXKiwGw8W2C8",
  authDomain: "eco-flow-bin.firebaseapp.com",
  databaseURL: "https://eco-flow-bin-default-rtdb.firebaseio.com",
  projectId: "eco-flow-bin",
  storageBucket: "eco-flow-bin.appspot.com",
  messagingSenderId: "704131179397",
  appId: "1:704131179397:web:5eb3737d854b0125cddaec",
  measurementId: "G-R2B073XGD8"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Static bins with Mysuru city locations
const dustbinData = {
  'bin-001': { name: 'Devaraja Market', location: 'Near Devaraja Market, Mysuru', fillLevel: 23, status: 'Low' },
  'bin-002': { name: 'Mysuru Palace Area', location: 'Near Mysuru Palace, City Center', fillLevel: 66, status: 'Medium' },
  'bin-003': { name: 'Vijayanagar', location: 'Vijayanagar Layout, Mysuru', fillLevel: 85, status: 'High' },
  'bin-004': { name: 'Kuvempunagar', location: 'Kuvempunagar, Mysuru', fillLevel: 98, status: 'Full' },
  'bin-005': { name: 'Gokulam', location: 'Gokulam, Mysuru', fillLevel: 15, status: 'Low' },
  'bin-006': { name: 'Hebbal', location: 'Hebbal, Mysuru', fillLevel: 48, status: 'Medium' },
  'bin-007': { name: 'Nazarbad', location: 'Nazarbad, Mysuru', fillLevel: 20, status: 'Low' },
  'bin-008': { name: 'Lakshmipuram', location: 'Lakshmipuram, Mysuru', fillLevel: 79, status: 'High' },
  'bin-009': { name: 'Bannimantap', location: 'Bannimantap, Mysuru', fillLevel: 100, status: 'Full' },
  'bin-010': { name: 'Chamundipuram', location: 'Chamundipuram, Mysuru', fillLevel: 45, status: 'Medium' },
  'bin-011': { name: 'Saraswathipuram', location: 'Saraswathipuram, Mysuru', fillLevel: 32, status: 'Low' },
  'bin-012': { name: 'Udayagiri', location: 'Udayagiri, Mysuru', fillLevel: 78, status: 'High' },
  'bin-013': { name: 'Bogadi', location: 'Bogadi, Mysuru', fillLevel: 55, status: 'Medium' },
  'bin-014': { name: 'Yadavagiri', location: 'Yadavagiri, Mysuru', fillLevel: 18, status: 'Low' },
  'bin-015': { name: 'JSS Road Area', location: 'JSS Road, Mysuru', fillLevel: 95, status: 'Full' }
};

// Truck data for Truck Dashboard
const truckData = {
  currentArea: 'Vijayanagar',
  status: 'En Route', // En Route / Collecting / Returning
  collectedBins: ['bin-001', 'bin-005'],
  routeProgress: 40,
  totalBinsOnRoute: 5,
  route: [
    { id: 'bin-001', name: 'Devaraja Market', status: 'collected' },
    { id: 'bin-005', name: 'Gokulam', status: 'collected' },
    { id: 'bin-003', name: 'Vijayanagar', status: 'current' },
    { id: 'bin-004', name: 'Kuvempunagar', status: 'pending' },
    { id: 'bin-008', name: 'Lakshmipuram', status: 'pending' }
  ]
};

document.addEventListener('DOMContentLoaded', () => {
  const isDetailsPage = document.querySelector('.details-container');
  const isHomePage = document.querySelector('.dustbin-grid');

  if (isDetailsPage) initDetailsPage();
  if (isHomePage) initHomePage();

  // Firebase listener (moved here!)
  const ref = database.ref('ecoflow/bin-001');
  ref.on('value', (snapshot) => {
    const data = snapshot.val();
    if (data) {
      dustbinData['bin-001'] = {
        name: data.name || 'VVCE Campus',
        location: data.location || 'Main Entrance, VVCE Mysuru',
        fillLevel: data.fillLevel || 0,
        status: data.status || 'Low'
      };

      if (isHomePage) updateHomePageCards();
      const urlParams = new URLSearchParams(window.location.search);
      const currentId = urlParams.get('id');
      if (isDetailsPage && currentId === 'bin-001') {
        updateDustbinDetails('bin-001');
      }
    }
  });

  function initHomePage() {
    updateHomePageCards();
  }

  function updateHomePageCards() {
    const cards = document.querySelectorAll('.dustbin-card');
    cards.forEach(card => {
      const binId = card.getAttribute('data-id');
      const data = dustbinData[binId];
      if (data) {
        const statusSpan = card.querySelector('.status-low, .status-medium, .status-high, .status-full');
        const fillLevelSpan = card.querySelector('.fill-level');

        if (statusSpan) {
          statusSpan.textContent = data.status;
          statusSpan.className = `status-${data.status.toLowerCase()}`;
        }

        if (fillLevelSpan) {
          fillLevelSpan.textContent = `${data.fillLevel}%`;
        }
      }
    });
  }

  function initDetailsPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const binId = urlParams.get('id');

    function waitForBinAndUpdate() {
      if (dustbinData[binId]) {
        updateDustbinDetails(binId);
        setInterval(() => {
          if (binId !== 'bin-001') simulateRealTimeData(binId);
          updateDustbinDetails(binId);
        }, 2000);
      } else {
        setTimeout(waitForBinAndUpdate, 200);
      }
    }

    waitForBinAndUpdate();
  }

  function updateDustbinDetails(binId) {
    const data = dustbinData[binId];
    if (!data) return;

    const { name, fillLevel, status } = data;
    const statusClass = `status-${status.toLowerCase()}`;
    const statusColor = getComputedStyle(document.documentElement).getPropertyValue(`--${statusClass}`);

    document.getElementById('dustbin-id').textContent = `Dustbin ${name}`;
    document.getElementById('dustbin-status').textContent = status;
    document.getElementById('dustbin-status').className = statusClass;

    const fillValueElement = document.getElementById('fill-level-value');
    fillValueElement.textContent = fillLevel;
    fillValueElement.parentElement.style.color = statusColor;

    fillValueElement.parentElement.classList.add('updated');
    setTimeout(() => {
      fillValueElement.parentElement.classList.remove('updated');
    }, 500);

    document.getElementById('progress-bar-inner').style.width = `${fillLevel}%`;
    document.getElementById('progress-bar-inner').style.backgroundColor = statusColor;
  }

  function simulateRealTimeData(binId) {
    if (binId === 'bin-001') return;
    let currentFill = dustbinData[binId].fillLevel;
    let newFill = currentFill + Math.floor(Math.random() * 5) - 2;
    newFill = Math.max(0, Math.min(100, newFill));
    dustbinData[binId].fillLevel = newFill;
    dustbinData[binId].status = getStatusFromFillLevel(newFill);
  }

  function getStatusFromFillLevel(level) {
    if (level >= 95) return 'Full';
    if (level >= 75) return 'High';
    if (level >= 40) return 'Medium';
    return 'Low';
  }
});

// Truck Dashboard Functions
function initTruckDashboard() {
  const isTruckPage = document.querySelector('.truck-dashboard');
  if (!isTruckPage) return;
  
  updateTruckDashboard();
  
  // Update truck position every 3 seconds for simulation
  setInterval(simulateTruckMovement, 3000);
}

function updateTruckDashboard() {
  // Update current area
  const currentAreaEl = document.getElementById('truck-current-area');
  if (currentAreaEl) {
    currentAreaEl.textContent = truckData.currentArea;
  }
  
  // Update status
  const statusEl = document.getElementById('truck-status');
  if (statusEl) {
    statusEl.textContent = truckData.status;
    statusEl.className = `status-${truckData.status.toLowerCase().replace(' ', '-')}`;
  }
  
  // Update route progress
  const progressEl = document.getElementById('route-progress');
  if (progressEl) {
    progressEl.style.width = `${truckData.routeProgress}%`;
  }
  
  const progressTextEl = document.getElementById('route-progress-text');
  if (progressTextEl) {
    progressTextEl.textContent = `${truckData.routeProgress}%`;
  }
  
  // Update collected bins count
  const collectedCountEl = document.getElementById('collected-count');
  if (collectedCountEl) {
    collectedCountEl.textContent = truckData.collectedBins.length;
  }
  
  const totalBinsEl = document.getElementById('total-bins');
  if (totalBinsEl) {
    totalBinsEl.textContent = truckData.totalBinsOnRoute;
  }
  
  // Update route list
  const routeListEl = document.getElementById('route-list');
  if (routeListEl) {
    routeListEl.innerHTML = '';
    truckData.route.forEach(stop => {
      const stopEl = document.createElement('div');
      stopEl.className = `route-stop ${stop.status}`;
      stopEl.innerHTML = `
        <i class="fa-solid ${getRouteIcon(stop.status)}"></i>
        <span>${stop.name}</span>
        <span class="stop-status">${getRouteStatusText(stop.status)}</span>
      `;
      routeListEl.appendChild(stopEl);
    });
  }
}

function getRouteIcon(status) {
  switch(status) {
    case 'collected': return 'fa-check-circle';
    case 'current': return 'fa-location-dot fa-spin';
    case 'pending': return 'fa-circle';
    default: return 'fa-circle';
  }
}

function getRouteStatusText(status) {
  switch(status) {
    case 'collected': return 'Collected';
    case 'current': return 'En Route';
    case 'pending': return 'Pending';
    default: return '';
  }
}

function simulateTruckMovement() {
  const currentIndex = truckData.route.findIndex(stop => stop.status === 'current');
  
  if (currentIndex >= 0 && currentIndex < truckData.route.length - 1) {
    // Mark current as collected
    truckData.route[currentIndex].status = 'collected';
    truckData.collectedBins.push(truckData.route[currentIndex].id);
    
    // Move to next
    truckData.route[currentIndex + 1].status = 'current';
    truckData.currentArea = truckData.route[currentIndex + 1].name;
    truckData.status = 'En Route';
    truckData.routeProgress = Math.round(((currentIndex + 1) / truckData.route.length) * 100);
  } else if (currentIndex === truckData.route.length - 1) {
    // Route complete - returning
    truckData.status = 'Returning';
    truckData.routeProgress = 100;
  }
  
  updateTruckDashboard();
}

// Initialize truck dashboard if on that page
document.addEventListener('DOMContentLoaded', initTruckDashboard);
