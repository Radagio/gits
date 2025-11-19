(function() {
    'use strict';

    // --- CONFIGURATION ---
    // A simple notification sound (Beep) in Base64 format to avoid external link issues
    const soundFile = "data:audio/wav;base64,UklGRl9vT1BXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU"; // Short beep placeholder, see below for full sound
    
    // Use a longer, louder sound (Doorbell style)
    const alertSound = new Audio("https://actions.google.com/sounds/v1/alarms/beep_short.ogg"); 
    // If the link above is blocked by your firewall, use the Base64 version at the bottom of this post.

    // --- LOGIC ---

    // 1. Identify the column containing the Unique IDs based on your HTML
    // Your HTML uses the class 'list-field-id' for the ID cells.
    const idCells = document.querySelectorAll('.list-field-id');
    
    // 2. Extract the current IDs into an Array
    let currentIds = [];
    idCells.forEach(function(cell) {
        // Remove whitespace and grab the text (e.g., "905628")
        let id = cell.innerText.trim();
        if(id) currentIds.push(id);
    });

    console.log("Current Truck IDs:", currentIds);

    // 3. Retrieve the IDs from the previous refresh (from LocalStorage)
    const storageKey = 'chimpex_truck_monitor_ids';
    let lastKnownIds = localStorage.getItem(storageKey);

    // 4. Compare and Act
    if (lastKnownIds) {
        lastKnownIds = JSON.parse(lastKnownIds);
        
        // Check if there is any ID in 'currentIds' that was NOT in 'lastKnownIds'
        let newTrucks = currentIds.filter(x => !lastKnownIds.includes(x));

        if (newTrucks.length > 0) {
            console.log("NEW TRUCK DETECTED:", newTrucks);
            
            // A. Play Sound
            alertSound.play().catch(error => {
                console.log("Audio blocked by browser policy. Interact with page first.", error);
            });

            // B. Visual Notification (Make the background flash red)
            document.body.style.backgroundColor = "#ffcccc";
            
            // C. Highlight the specific new row(s)
            idCells.forEach(function(cell) {
                if (newTrucks.includes(cell.innerText.trim())) {
                    cell.parentElement.style.backgroundColor = "#ff0000";
                    cell.parentElement.style.color = "white";
                    cell.parentElement.style.fontWeight = "bold";
                }
            });

            // D. Add a message at the top
            let msg = document.createElement("div");
            msg.innerHTML = "<h1 style='background:red; color:white; text-align:center; padding: 20px; margin:0;'>⚠️ NEW TRUCK DETECTED! ⚠️</h1>";
            document.body.prepend(msg);
        }
    } else {
        console.log("First run - initializing database.");
    }

    // 5. Save current IDs to LocalStorage for the NEXT refresh
    localStorage.setItem(storageKey, JSON.stringify(currentIds));

    // Optional: Visual indicator that script is running
    let status = document.createElement("div");
    status.style.position = "fixed";
    status.style.bottom = "10px";
    status.style.right = "10px";
    status.style.background = "green";
    status.style.color = "white";
    status.style.padding = "5px 10px";
    status.style.zIndex = "9999";
    status.style.borderRadius = "5px";
    status.innerText = "Truck Monitor: ON";
    document.body.appendChild(status);

})();