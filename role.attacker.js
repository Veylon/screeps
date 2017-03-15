function findTarget(creep) {
    // Find Immediately next to
    console.log("Finding New Target");
    var creeps = creep.room.find(FIND_CREEPS, { filter: { my: false } });
    var enemies = creep.pos.findInRange(creeps, 1);
    if (enemies.length)
        creep.memory.target = enemies[0].id;
    else
    {
        console.log(creep.name + "No nearby enemies");
        // Find closest enemy in same room
        enemy = creep.pos.findClosestByRange(creeps)
        if (enemy) {
            creep.memory.target = enemy.id;
        }
        else {
            /*
            console.log(creep.name + "No enemies in room. Looking for structure.");
            var estructs = creep.room.find(FIND_STRUCTURES);
            if (estructs.length) {
                var target = creep.pos.findClosestByRange(estructs);
                creep.memory.target = null;
            }
            else {
            */
                console.log(creep.name + "No structures in room. Moving on.");
                creep.memory.job = null;
                creep.memory.target = null;
//            }
        }
    }
}

var roleAttacker = {
    /** @param {Creep} creep **/
    run: function (creep) {
//        console.log("Attacker");
        if (creep.memory.job == "attack") {
            console.log(creep.name + " Attacking");
            if (creep.memory.target) {
                var target = Game.getObjectById(creep.memory.target);
                console.log(creep.name + ": Target: " + target);
                if (target) {
                    var res = creep.attack(target);
                    if (res == ERR_NOT_IN_RANGE)
                        creep.moveTo(target);
                }
                else {
                    findTarget(creep);
                    // run(creep);
                }
            }
            else {
                findTarget(creep);
                // run(creep);
            }
        }
        else if (creep.memory.job == "hold") {
            if (creep.ticksToLive < 1200) {
                creep.memory.job = "renew";
            }
            for (var name in Game.flags) {
                var flag = Game.flags[name];
                if (flag.color == COLOR_GREEN) {
                    creep.memory.path = creep.pos.findPathTo(flag.pos);
                }
                else if (flag.color == COLOR_RED) {
                    console.log(creep.name + "Found Red Flag");
                    var creeps = Game.rooms[flag.pos.roomName].find(FIND_CREEPS, { filter: { my: false } });
                    console.log(creeps);
                    if (creeps.length)
                    {
                        var target = flag.pos.findClosestByRange(creeps);
                        console.log(creep.name + "Found targets");
                        creep.memory.path = null;
                        creep.say("Attack");
                        creep.memory.job = "attack";
                        creep.memory.target = target.id;
                    }
                }
            }
        }
        else if(creep.memory.job == "renew") {
            var spawns = creep.room.find(FIND_MY_SPAWNS);
            if (spawns.length) {
                var res = spawns[0].renewCreep(creep);
                if (res == ERR_NOT_IN_RANGE) {
                    //                    creep.moveTo(spawns[0])
                    creep.memory.path = creep.pos.findPathTo(spawns[0]);
                }
                if (creep.ticksToLive > 1400) {
                    creep.memory.job = null;
                }
            }
            else {
                // No Spawns
                creep.say("No Spawns!");
                creep.memory.job = null;
            }
        }
        else {
            console.log(creep.name + " Put to hold");
            creep.memory.job = "hold";
        }
    }
};

module.exports = roleAttacker