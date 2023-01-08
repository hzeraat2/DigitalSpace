export let totalFuelConsumed = 0;
export let totalVehiclesServed = 0;
export let totalVehiclesLeftWithoutService = 0;
export let totalCarsInQueue = [];

export const carTypes = [
    { type: "Car", tankCapacity: 10, fuelType: ["Diesel", "LPG", "Unleaded"] },
    { type: "Van", tankCapacity: 80, fuelType: ["Diesel", "LPG"] }, 
    { type: "HGV", tankCapacity: 150, fuelType: ["Diesel"] },
]
export const totalFuelTransactions = []; // (DateTime, fuel type, number of litres dispensed)

export const fuelPumps = {
    lane1: [{ Pump: 3, inUse: false }, { Pump: 2, inUse: false }, { Pump: 1, inUse: false }],
    lane2: [{ Pump: 6, inUse: false }, { Pump: 5, inUse: false }, { Pump: 4, inUse: false }],
    lane3: [{ Pump: 9, inUse: false }, { Pump: 8, inUse: false }, { Pump: 7, inUse: false }],
};