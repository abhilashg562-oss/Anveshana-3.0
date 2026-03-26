document.addEventListener('DOMContentLoaded', () => {

    // --- Data Structure ---
    // This is a sample data structure for the dustbins.
    // In a real application, this data would come from a server or API connected to the IoT sensors.
const MAX_CAPACITY_WEIGHT = 20;

function getWeight(fillPercentage) {
  return (fillPercentage / 100 * MAX_CAPACITY_WEIGHT).toFixed(1);
}

const dustbinData = {
        'bin-001': { name: 'VVCE Campus', location: 'Main Entrance, VVCE Mysuru', fillPercentage: 23, maxCapacity: MAX_CAPACITY_WEIGHT, status: 'Low' },
        'bin-002': { name: 'Library Cafe', location: 'Near Central Library, VVCE', fillPercentage: 66, maxCapacity: MAX_CAPACITY_WEIGHT, status: 'Medium' },
        'bin-003': { name: 'Hostel Block A', location: 'Behind Boys Hostel A, VVCE', fillPercentage: 85, maxCapacity: MAX_CAPACITY_WEIGHT, status: 'High' },
        'bin-004': { name: 'Workshop Area', location: 'Mechanical Dept. Workshop, VVCE', fillPercentage: 98, maxCapacity: MAX_CAPACITY_WEIGHT, status: 'Full' },
        'bin-005': { name: 'Canteen Exit', location: 'Near Canteen Block, VVCE', fillPercentage: 15, maxCapacity: MAX_CAPACITY_WEIGHT, status: 'Low' },
        'bin-006': { name: 'Sports Complex', location: 'Adjacent to Cricket Ground, VVCE', fillPercentage: 48, maxCapacity: MAX_CAPACITY_WEIGHT, status: 'Medium' },
        'bin-007': { name: 'ECE Department', location: 'Complex, ECE BLOCK, VVCE', fillPercentage: 20, maxCapacity: MAX_CAPACITY_WEIGHT, status: 'Low' },
        'bin-008': { name: 'Admin Block Parking', location: 'Visitor Parking, Admin Building, VVCE', fillPercentage: 79, maxCapacity: MAX_CAPACITY_WEIGHT, status: 'High' },
        'bin-009': { name: 'Food Court VVCE', location: 'Main Food Court, VVCE Campus', fillPercentage: 100, maxCapacity: MAX_CAPACITY_WEIGHT, status: 'Full', currentWeight: 20.0, holdStartTime: null }
    };

    // --- Router ---
    // Simple logic to determine which page is currently active.
    if (document.querySelector('.details-container')) {
        initDetailsPage();
    } else if (document.querySelector('.dustbin-grid')) {
        initHomePage();
    }

    // --- Home Page Logic ---
    function initHomePage() {
        // This function would periodically fetch data for all bins and update the homepage.
        // For this example, the data is static, but here's where you'd make the API call.
        // Your friend can implement the logic to fetch all dustbin data here.
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

                // Update status text and class
                statusSpan.textContent = data.status;
                statusSpan.className = `status-${data.status.toLowerCase()}`;
                
                // Update fill level
                fillLevelSpan.textContent = `${getWeight(data.fillPercentage)} kg`;
            }
        });
    }


    // --- Details Page Logic ---
    function initDetailsPage() {
        const urlParams = new URLSearchParams(window.location.search);
        const binId = urlParams.get('id');

        if (binId && dustbinData[binId]) {
            updateDustbinDetails(binId);

            // This interval simulates real-time updates every 2 seconds.
            setInterval(() => {
                // In a real-world scenario, you would fetch new data here.
                // For this simulation, we'll just randomly change the current bin's data.
                simulateRealTimeData(binId);
                updateDustbinDetails(binId);
            }, 2000);
        } else {
            // Handle case where bin ID is missing or invalid
            const detailsHeader = document.querySelector('.details-header h1');
            if(detailsHeader) detailsHeader.textContent = "Dustbin Not Found";
        }
    }

    /**
     *  ============================================================================
     *  === IOT IMPLEMENTATION AREA FOR YOUR FRIEND ===
     *  ============================================================================
     *
     *  This is the main function for your friend to focus on.
     *  It needs to get the latest data for a specific dustbin.
     *
     *  - binId: The ID of the dustbin to get data for (e.g., 'bin-001').
     *
     *  You should replace the content of `simulateRealTimeData` 
     *  with an actual API call to your backend/IoT platform.
     * 
     */
function simulateRealTimeData(binId) {
        const MAX_WEIGHT = 20;
        const MIN_INC = 0.1;
        const MAX_INC = 0.3;
        const HOLD_DURATION = 10000; // 10 seconds

        let bin = dustbinData[binId];
        if (bin.currentWeight === undefined) {
          bin.currentWeight = parseFloat(getWeight(bin.fillPercentage));
          bin.holdStartTime = null;
        }

        const now = Date.now();

        // Check if hold period ended
        if (bin.holdStartTime && (now - bin.holdStartTime) >= HOLD_DURATION) {
          bin.currentWeight = 0;
          bin.holdStartTime = null;
        } else if (bin.currentWeight >= MAX_WEIGHT) {
          // Hold at max or start hold
          if (!bin.holdStartTime) bin.holdStartTime = now;
          bin.currentWeight = MAX_WEIGHT;
        } else {
          // Gradual increment
          const increment = MIN_INC + Math.random() * (MAX_INC - MIN_INC);
          bin.currentWeight += increment;
          bin.holdStartTime = null;
        }

        // Update derived values
        bin.fillPercentage = Math.min(100, (bin.currentWeight / MAX_WEIGHT * 100));
        bin.status = getStatusFromFillPercentage(bin.fillPercentage);
    }

    function updateDustbinDetails(binId) {
        const data = dustbinData[binId];
        if (!data) return;
        
        const { name, fillPercentage, status } = data;
        const statusClass = `status-${status.toLowerCase()}`;
        const statusColor = getComputedStyle(document.documentElement).getPropertyValue(`--${statusClass}`);

        // Update DOM Elements
        document.getElementById('dustbin-id').textContent = `Dustbin ${name}`;
        document.getElementById('dustbin-status').textContent = status;
        document.getElementById('dustbin-status').className = statusClass;
        
        const fillValueElement = document.getElementById('fill-level-value');
        fillValueElement.textContent = getWeight(fillPercentage);
        fillValueElement.parentElement.style.color = statusColor;
        
        // Add class to trigger pulse animation, then remove it
        fillValueElement.parentElement.classList.add('updated');
        setTimeout(() => {
            fillValueElement.parentElement.classList.remove('updated');
        }, 500); // Duration of the animation

        document.getElementById('progress-bar-inner').style.width = `${fillPercentage}%`;
        document.getElementById('progress-bar-inner').style.backgroundColor = statusColor;
    }

    function getStatusFromFillPercentage(percentage) {
        if (percentage >= 95) return 'Full';
        if (percentage >= 75) return 'High';
        if (percentage >= 40) return 'Medium';
        return 'Low';
    }
}); 