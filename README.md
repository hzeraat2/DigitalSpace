## Run the app
```
npm i
npm start
```
## Fuel pump task
The automated demo app refers to a forecourt with nine fuel pumps arranged over three lanes. Each lane has three pumps, and a pump cannot serve more than one vehicle at a time, so there must be a queuing system in the forecourt (a vehicle using pump 3 prevents other vehicles accessing pumps 1 and 2 etc.).

Pump 3 | Pump 2 | Pump 1
------------------------
Pump 6 | Pump 5 | Pump 4
------------------------
Pump 9 | Pump 8 | Pump 7

There are three types of fuel (Diesel, LPG and Unleaded). All pumps contain all kinds of fuel and are capable of dispensing 1.5 litres/second. A new vehicle is created randomly every 1500 to 2200 milliseconds unless there are five vehicles in the queue. The type and fuel of newly created vehicles will be random.

Type |  Tank capacity (litres) | Fuel type(s)
Car  |  10                     | Diesel, LPG, Unleaded
Van  |  80                     | Diesel, LPG
HGV  | 150                     | Diesel

To add to the realism of the simulation and to account for drivers’ agitation, should a vehicle not be fuelled randomly between one and two seconds, it will leave the forecourt. Newly created vehicles will have a random amount of fuel already in their tank which cannot be greater than a quarter of their total tank capacity. The fuelling starts when a vehicle waiting in the queue is automatically assigned to an available pump. After filling the vehicle’s tank, it leaves the forecourt, freeing the pump for use.

The following must be kept:
1. The running total of the number of litres dispensed during the app’s lifetime
2. The number of vehicles serviced.
3. The number of vehicles that left before they were fuelled
4. A detailed list of each fuelling transaction (DateTime, fuel type, number of litres dispensed).

Please create a simple simulation application which tackles as many of these requirements as you see fit within 90 minutes. We don’t expect a graphical user interface and we don’t expect you to tackle all the requirements but to be able to discuss what you did do and what was left out and how you would extend the solution if you had enough time.
