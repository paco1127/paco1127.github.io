let antimatter = new Decimal(0);
let generators = [{ count: new Decimal(0), cost: new Decimal(1) }];

function updateUI() {
    document.getElementById('antimatter').textContent = formatLargeNumber(antimatter);
    let generatorsContainer = document.getElementById('generators');
    generatorsContainer.innerHTML = `<button onclick="produceAntimatter()">Produce Number</button>
                                     <button onclick="buyMaxAllGenerators()">Buy Max All</button>`;

    generators.forEach((gen, index) => {
        let buttonHTML = `<div>
            Generator Level ${index + 1}: <span>${formatLargeNumber(gen.count).toString()}</span> -
            <button onclick="buyGenerator(${index})">Cost: ${formatLargeNumber(gen.cost)}</button>
            <button onclick="buyMaxGenerators(${index})">Buy Max</button>
        </div>`;
        generatorsContainer.innerHTML += buttonHTML;
    });
}

function produceAntimatter() {
    antimatter = antimatter.plus(1);
    updateUI();
}

function buyMaxGenerators(level) {
    let generator = generators[level];
    let maxCanBuy = calculateMaxBuy(generator.cost, antimatter, level);
    
    if (maxCanBuy.greaterThan(0)) {
        // Calculate total cost for max generators
        let totalCost = generator.cost.times(Decimal.pow(1.5, maxCanBuy).minus(1).div(0.5));

        // Update generator count and antimatter
        generator.count = generator.count.plus(maxCanBuy);
        antimatter = antimatter.minus(totalCost);
        generator.cost = generator.cost.times(Decimal.pow(1.5, maxCanBuy));

        // Automatically add a new generator if the purchased one was the highest level
        if (level === generators.length - 1) {
            generators.push({
                count: new Decimal(0),
                cost: generator.cost.times(10)
            });
        }

        updateUI();
    } else {
        
    }
}

function buyMaxAllGenerators() {
    let didBuy = false; // Flag to check if at least one generator was bought
    
    generators.forEach((generator, index) => {
        let maxCanBuy = calculateMaxBuy(generator.cost, antimatter, index);
        if (maxCanBuy.greaterThan(0)) {
            let totalCost = generator.cost.times(Decimal.pow(1.5, maxCanBuy).minus(1).div(0.5));
            generator.count = generator.count.plus(maxCanBuy);
            antimatter = antimatter.minus(totalCost);
            generator.cost = generator.cost.times(Decimal.pow(1.5, maxCanBuy));
            didBuy = true;

            if (index === generators.length - 1) {
                generators.push({ count: new Decimal(0), cost: generator.cost.times(10) });
            }
        }
    });

    if (didBuy) {
        updateUI();
    } else {
        
    }
}

function calculateMaxBuy(initialCost, availableAntimatter, level) {
    const costMultiplier = new Decimal(1);
    let maxBuy = new Decimal(0);
    let currentCost = initialCost;
    let totalCost = new Decimal(0);

    while (availableAntimatter.gte(currentCost)) {
        availableAntimatter = availableAntimatter.minus(currentCost);
        totalCost = totalCost.plus(currentCost);
        currentCost = currentCost.times(costMultiplier);
        maxBuy = maxBuy.plus(1);

        // Check if adding another generator exceeds available antimatter
        if (availableAntimatter.lt(currentCost)) {
            break;
        }
    }

    return maxBuy;
}

function buyGenerator(level) {
    if (antimatter.gte(generators[level].cost)) {
        antimatter = antimatter.minus(generators[level].cost);
        generators[level].count = generators[level].count.plus(1);
        generators[level].cost = generators[level].cost.times(1.5);

        // Automatically add a new generator if the purchased one was the highest level
        if (level === generators.length - 1) {
            generators.push({
                count: new Decimal(0),
                cost: generators[level].cost.times(1)
            });
        }
        updateUI();
    } else {
        
    }
}

function gameTick() {
    for (let i = generators.length - 1; i > 0; i--) {
        generators[i - 1].count = generators[i - 1].count.plus(generators[i].count);
    }
    if (generators.length > 0) {
        antimatter = antimatter.plus(generators[0].count);
    }
    updateUI();
}

let tickInterval = 1000; // 1000 milliseconds
let tickTimer = setInterval(gameTick, tickInterval);

function speedUpTicks() {
    clearInterval(tickTimer);
    tickInterval = Math.max(100, tickInterval * 0.5);
    tickTimer = setInterval(gameTick, tickInterval);
}

function generateSuffixes() {
    const ones = ["", "un", "duo", "tre", "quattuor", "quin", "sex", "septen", "octo", "novem"];
    const tens = ["", "dec", "vigint", "trigint", "quadragint", "quinquagint", "sexagint", "septuagint", "octogint", "nonagint"];
    const hundreds = ["", "cent", "ducent", "trecent", "quadringent", "quingent", "sescent", "septingent", "octingent", "nongent"];
    let suffixes = ["", "thousand", "million", "billion", "trillion"]; // Start with the base cases

    for (let h = 0; h < hundreds.length; h++) {
        for (let t = 0; t < tens.length; t++) {
            for (let o = 1; o < ones.length; o++) {
                let prefix = ones[o] + tens[t] + hundreds[h];
                if (prefix !== "") {
                    suffixes.push(prefix + "illion");
                }
            }
        }
    }

    return suffixes;
}

function formatLargeNumber(number) {
    const suffixes = generateSuffixes();
    let index = 0;
    let scaledNumber = number;

    while (scaledNumber >= 1000 && index < suffixes.length - 1) {
        scaledNumber /= 1000;
        index++;
    }

    return `${scaledNumber.toFixed(2)} ${suffixes[index]}`;
}

updateUI();