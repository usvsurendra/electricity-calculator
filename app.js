// Simulated state-wise data configurations
const stateTariffs = {
    "AP": {
        fixedCharge: 100,
        slabs: [
            { min: 0, max: 50, rate: 3.25 },
            { min: 50, max: 100, rate: 4.80 },
            { min: 100, max: 200, rate: 6.30 },
            { min: 200, max: Infinity, rate: 7.40 }
        ]
    },
    "MH": {
        fixedCharge: 125,
        slabs: [
            { min: 0, max: 100, rate: 4.50 },
            { min: 100, max: 300, rate: 8.50 },
            { min: 300, max: Infinity, rate: 12.00 }
        ]
    },
    "DL": {
        fixedCharge: 50,
        slabs: [
            { min: 0, max: 200, rate: 3.00 },
            { min: 200, max: 400, rate: 4.50 },
            { min: 400, max: Infinity, rate: 6.50 }
        ]
    }
};

document.getElementById('calculateBtn').addEventListener('click', () => {
    const state = document.getElementById('stateSelect').value;
    const totalUnits = parseFloat(document.getElementById('unitsInput').value) || 0;
    
    const config = stateTariffs[state];
    let remainingUnits = totalUnits;
    let totalEnergyCharge = 0;
    
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = ''; // Clear previous calculations

    // Telescopic slab calculation loop
    config.slabs.forEach(slab => {
        if (remainingUnits <= 0) return;

        const slabRange = slab.max - slab.min;
        const unitsInThisSlab = Math.min(remainingUnits, slabRange);
        const charge = unitsInThisSlab * slab.rate;
        
        totalEnergyCharge += charge;
        remainingUnits -= unitsInThisSlab;

        // Add visual row to breakdown table
        const row = `<tr>
            <td>${slab.min} - ${slab.max === Infinity ? 'Above' : slab.max}</td>
            <td>${unitsInThisSlab.toFixed(1)}</td>
            <td> can change to ₹${slab.rate.toFixed(2)}</td>
            <td>₹${charge.toFixed(2)}</td>
        </tr>`;
        tableBody.innerHTML += row;
    });

    // Tax and total math formulas
    const electricityDuty = totalEnergyCharge * 0.05; // 5% Duty
    const finalBill = totalEnergyCharge + config.fixedCharge + electricityDuty;

    // Output to interface
    document.getElementById('energyChargeText').innerText = `₹${totalEnergyCharge.toFixed(2)}`;
    document.getElementById('fixedChargeText').innerText = `₹${config.fixedCharge.toFixed(2)}`;
    document.getElementById('dutyText').innerText = `₹${electricityDuty.toFixed(2)}`;
    document.getElementById('totalBillText').innerText = `₹${finalBill.toFixed(2)}`;

    // Unhide layout section
    document.getElementById('resultSection').className = "";
});
