import { Machine } from "./Machine.js";

let speed = 0;

let machine = new Machine("IDLE", {
    IDLE: {rev: () => {speed++, machine.changeState("MOVING")}},
    MOVING: {
        rev: () => {
            speed++;
            if (speed > 3) {
                machine.changeState("CRASHED");
                speed = 0;
            }
        },
        brake: () => {
            speed--;
            if (speed == 0) machine.changeState("IDLE");
        }
    },
})

let commands = ["rev", "brake"]

console.log(speed, machine.state);
while (machine.state != "CRASHED") {
    let command = commands[Math.floor(Math.random()*commands.length)]
    machine.dispatch(command);
    console.log(command, "\n", speed, machine.state);
}

console.log("You went too fast.");