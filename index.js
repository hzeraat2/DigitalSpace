const { totalFuelTransactions, totalCarsInQueue, carTypes, fuelPumps } = require('./settings');

let totalFuelConsumed = 0;
let totalVehiclesServed = 0;
let totalVehiclesLeftWithoutService = 0;

/**
 *
 * @param {*} fuelType e.g. "Diesel", "LPG", "Unleaded"
 * @param {*} numberOfLitresDispensed number of litres dispensed per transaction
 */
const appendTotalTransaction = (fuelType, numberOfLitresDispensed) => {
    const transactionDateTime = new Date().toISOString();

    const transactionObject = {
        dateTime: transactionDateTime,
        fuelType: fuelType,
        numberOfLitresDispensed: numberOfLitresDispensed
    };

    totalFuelTransactions.push(transactionObject);
}

/**
 * This function fuels the cars tank, updates stats and sets inUse to false after vehicle is filled.
 */

const fuelVehicle = (laneNumber, pumpIndex) => {
    const refuelPaceInterval = 1000;
    const refuelPace = 1.5 // 1.5 litres/second

    if (totalCarsInQueue.length > 0) {
        let totalLitersDispensedPerTransaction = 0;
        const currentCarOutOfQueue = totalCarsInQueue.shift(); // reduce car numbers in queue by 1 
        console.log(`Servicing vehicle: ${currentCarOutOfQueue.type}, ${currentCarOutOfQueue.fuelType} in ${laneNumber}`);

        const interval = setInterval(() => {
            if (currentCarOutOfQueue.currentFuelInTank < currentCarOutOfQueue.tankCapacity) {
                currentCarOutOfQueue.currentFuelInTank += refuelPace;
                totalFuelConsumed += refuelPace;
                totalLitersDispensedPerTransaction += refuelPace;
                console.log(`${currentCarOutOfQueue.type}, ${currentCarOutOfQueue.fuelType} fuel in tank:`, currentCarOutOfQueue.currentFuelInTank);

            } else {
                fuelPumps[laneNumber][pumpIndex].inUse = false;
                totalVehiclesServed += 1;
                appendTotalTransaction(currentCarOutOfQueue.fuelType, totalLitersDispensedPerTransaction);
                clearInterval(interval);
                console.log(`Vehicle: ${currentCarOutOfQueue.type}, ${currentCarOutOfQueue.fuelType} re-fueled and left the station.`);
            }

        }, refuelPaceInterval)

    }
}

/**
 *
 * @param {*} laneNumber can be lane1, lane2 or lane3
 * @returns  {didFindPump, pumpIndex} true and pump index if vehicle finds a free pump in lane otherwise returns false, null
 */
const checkAndUseEmptyPumpInLane = (laneNumber) => {
    for (let i = 0; i < fuelPumps[laneNumber].length; i++) {
        if (!fuelPumps[laneNumber][i].inUse) {
            fuelPumps[laneNumber][i].inUse = true;
            return { didFindPump: true, pumpIndex: i };
        }
    }
    return { didFindPump: false, pumpIndex: null };
}

/**
 * This function traverses the fuelPumps object to find an available pump
 * it keeps searching for an empty pump every 200 milliseconds
 */
const findFreePump = (carIndex) => {
    let totalWaitTime = 0;
    const randomWaitTime = Math.random() * 2000;
    const counterInMilliSeconds = 200
    const interval = setInterval(() => {
        totalWaitTime += counterInMilliSeconds;

        if (totalWaitTime >= randomWaitTime) {
            console.log('Driver leaves without being served!');
            totalCarsInQueue.splice(carIndex, 1)
            totalVehiclesLeftWithoutService += 1;
            clearInterval(interval);
        }

        for (let i = 1; i <= 3; i++) {
            const { didFindPump, pumpIndex } = checkAndUseEmptyPumpInLane(`lane${i}`);
            if (didFindPump) {
                fuelVehicle(`lane${i}`, pumpIndex);
                clearInterval(interval);
            }
        }
    }, counterInMilliSeconds);
}

/**
 * Creates Vehicles of random type and fuel type
 */
createVehicleAddToQueue = () => {
    const randomCarIndex = Math.floor(Math.random() * 3);
    const randomFuelTypeIndex = Math.floor((carTypes[randomCarIndex].fuelType.length - 1) * Math.random());
    const randomFuelAmountInTank = Math.round(Math.random() * (carTypes[randomCarIndex].tankCapacity / 4));
    const newVehicle = {
        type: carTypes[randomCarIndex].type,
        tankCapacity: carTypes[randomCarIndex].tankCapacity,
        fuelType: carTypes[randomCarIndex].fuelType[randomFuelTypeIndex],
        currentFuelInTank: randomFuelAmountInTank
    }

    totalCarsInQueue.push(newVehicle);
    findFreePump(totalCarsInQueue.indexOf(newVehicle));
    console.log(totalCarsInQueue);
}

/**
 * Starts petrol station forecourt simulation, creating a new Vehicle
 * every 1500 - 2200 milliseconds if there are less than 5 vehicles in queue
 */
startSimulation = () => {
    const randomVehicleCreationTime = Math.floor(Math.random() * (2200 - 1500)) + 1500;
    const myInterval = setInterval(() => {
        if (totalCarsInQueue.length <= 4) createVehicleAddToQueue();
    }, randomVehicleCreationTime);
}

const keypress = async () => {
    process.stdin.setRawMode(true)
    return new Promise(resolve => process.stdin.once('data', () => {
        process.stdin.setRawMode(false)
        resolve()
    }))
}

(async () => {
    console.log('program still running, press any key to stop execution');
    await keypress();
    console.log('');
    console.log('------------------------');
    console.log('Petrol station report:');
    console.log('------------------------');
    console.log(`Total vehicles serviced: ${totalVehiclesServed}`);
    console.log(`Total vehicles left without service: ${totalVehiclesLeftWithoutService}`);
    console.log(`Total litres of fuel consumed: ${totalFuelConsumed}`);
    console.log('');
    console.log('------------------------');
    console.log('List of all transactions:')
    console.log('------------------------');
    console.log(`${JSON.stringify(totalFuelTransactions, null, 2)}`);

})().then(process.exit)

startSimulation();
