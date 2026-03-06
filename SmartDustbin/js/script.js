document.addEventListener('DOMContentLoaded', () => {

    // --- Data Structure ---
    // This is a sample data structure for the dustbins.
    // In a real application, this data would come from a server or API connected to the IoT sensors.
    const dustbinData = {
        'bin-001': { name: 'VVCE Campus', location: 'Main Entrance, VVCE Mysuru', fillLevel: 23, status: 'Low' },
        'bin-002': { name: 'Library Cafe', location: 'Near Central Library, VVCE', fillLevel: 66, status: 'Medium' },
        'bin-003': { name: 'Hostel Block A', location: 'Behind Boys Hostel A, VVCE', fillLevel: 85, status: 'High' },
        'bin-004': { name: 'Workshop Area', location: 'Mechanical Dept. Workshop, VVCE', fillLevel: 98, status: 'Full' },
        'bin-005': { name: 'Canteen Exit', location: 'Near Canteen Block, VVCE', fillLevel: 15, status: 'Low' },
        'bin-006': { name: 'Sports Complex', location: 'Adjacent to Cricket Ground, VVCE', fillLevel: 48, status: 'Medium' },
        'bin-007': { name: 'ECE Department', location: 'Complex, ECE BLOCK, VVCE', fillLevel: 20, status: 'Low' },
        'bin-008': { name: 'Admin Block Parking', location: 'Visitor Parking, Admin Building, VVCE', fillLevel: 79, status: 'High' },
        'bin-009': { name: 'Food Court VVCE', location: 'Main Food Court, VVCE Campus', fillLevel: 100, status: 'Full' }
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
                fillLevelSpan.textContent = `${data.fillLevel}%`;
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
        // ** FRIEND'S TO-DO: **
        // 1. Remove this simulation logic.
        // 2. Make a 'fetch' call to your API endpoint.
        //    e.g., fetch(`https://your-api.com/dustbins/${binId}`)
        // 3. Get the JSON response.
        // 4. Update the `dustbinData` object with the new fill level and status.
        
        // --- Start of Simulation Logic (to be replaced) ---
        let currentFill = dustbinData[binId].fillLevel;
        let newFill = currentFill + Math.floor(Math.random() * 5) - 2; // Fluctuate fill level
        newFill = Math.max(0, Math.min(100, newFill)); // Clamp between 0 and 100

        dustbinData[binId].fillLevel = newFill;
        dustbinData[binId].status = getStatusFromFillLevel(newFill);
        // --- End of Simulation Logic ---
    }

    function updateDustbinDetails(binId) {
        const data = dustbinData[binId];
        if (!data) return;
        
        const { name, fillLevel, status } = data;
        const statusClass = `status-${status.toLowerCase()}`;
        const statusColor = getComputedStyle(document.documentElement).getPropertyValue(`--${statusClass}`);

        // Update DOM Elements
        document.getElementById('dustbin-id').textContent = `Dustbin ${name}`;
        document.getElementById('dustbin-status').textContent = status;
        document.getElementById('dustbin-status').className = statusClass;
        
        const fillValueElement = document.getElementById('fill-level-value');
        fillValueElement.textContent = fillLevel;
        fillValueElement.parentElement.style.color = statusColor;
        
        // Add class to trigger pulse animation, then remove it
        fillValueElement.parentElement.classList.add('updated');
        setTimeout(() => {
            fillValueElement.parentElement.classList.remove('updated');
        }, 500); // Duration of the animation

        document.getElementById('progress-bar-inner').style.width = `${fillLevel}%`;
        document.getElementById('progress-bar-inner').style.backgroundColor = statusColor;
    }

    function getStatusFromFillLevel(level) {
        if (level >= 95) return 'Full';
        if (level >= 75) return 'High';
        if (level >= 40) return 'Medium';
        return 'Low';
    }
}); 