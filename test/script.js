let antimatter = 0;
let generators = 0;
let generatorCost = 10;

function updateUI() {
    document.getElementById('antimatter').textContent = Math.floor(antimatter);
    document.getElementById('generators').textContent = generators;
    document.getElementById('generatorCost').textContent = generatorCost;
}

function produceAntimatter() {
    antimatter += 1;
    updateUI();
}

function buyGenerator() {
    if (antimatter >= generatorCost) {
        antimatter -= generatorCost;
        generators += 1;
        generatorCost *= 1.5;  // Increases cost by 50% each time
        updateUI();
    } else {
        alert("Not enough antimatter to buy a generator!");
    }
}

setInterval(function() {
    // Produce antimatter from generators every second
    antimatter += generators * 1;
    updateUI();
}, 1000);

updateUI();