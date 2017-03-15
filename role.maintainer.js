var roleMaintainer = {

    /** @param {Creep} creep **/
    run: function (creep) {

        if (creep.ticksToLive < 100) {
            // Emergency maintenance
            creep.memory.job = null;
        }
        else if (creep.memory.job == undefined || creep.memory.job == null) {
            creep.say("No Job");
            // Find new jov
            if (creep.ticksToLive < 300) {
                // Regular maintenance
                creep.memory.job = "renew";
                creep.say("\u2665");
            }
            else if (creep.carry.energy == 0) {
                // Pick up energy
                creep.memory.job = "energy";
                creep.memory.target = null;
                creep.say("Energize!")
            }
            else if (creep.carry.energy > 0) {
                // Drop off energy
                creep.memory.job = "repair";
                creep.memory.target = null;
                creep.say("\u2016");
            }
        }
        else if (creep.memory.job == "renew") {
            var spawns = creep.room.find(FIND_MY_SPAWNS);
            if (spawns.length) {
                var res = spawns[0].renewCreep(creep);
            }
            else {
                // No Spawns
                creep.say("No Spawns!");
                creep.memory.target = Game.spawns.Spawn1.id;
            }
            if (res == ERR_NOT_IN_RANGE) {
                creep.memory.path = creep.pos.findPathTo();
                //                    creep.moveTo(spawns[0])
            }
            if (creep.ticksToLive > 1400) {
                creep.memory.job = null;
                //                    creep.say("Renewed!");
            }
        }
        else if (creep.memory.job == "energy") {
            if (creep.carry.energy == creep.carryCapacity) {
                creep.memory.job = null;
                creep.say("Full!");
            }
            else if (creep.memory.target) {
                var source = Game.getObjectById(creep.memory.target);
                var res = creep.harvest(source);
                if (res == ERR_NOT_IN_RANGE) {

//                    creep.moveTo(source.pos);
                    creep.memory.path = creep.pos.findPathTo(source.pos);

                    //                    creep.say("Moving");
                }
                else if (res == ERR_NOT_ENOUGH_RESOURCES) {
                    creep.job = null;
                }
                else if (res != OK) {
                    creep.say(res);
                }

            }
            else {
                var flags = creep.room.find(FIND_FLAGS, { filter: { color: COLOR_YELLOW } });
                //            console.log(sources);
                if (flags.length > 0) {
                    var choice = Math.floor(Math.random() * flags.length);
                    creep.memory.target = flags[choice].pos.findClosestByRange(FIND_SOURCES).id;
                    //                    creep.say("Target " + flags[choice].name);
                    //                    console.log(creep.memory.target);
                }
                else {
                    creep.say("No Sources");
                }
            }
        }
        else if (creep.memory.job == "repair") {
            if (creep.carry.energy == 0) {
                // Quit Delivery if no energy
                creep.memory.job = null;
            }
            else if (creep.memory.target) {
                target = Game.getObjectById(creep.memory.target);
                var res = creep.repair(target)
                if (res == ERR_NOT_IN_RANGE) {
                    creep.memory.path = creep.pos.findPathTo(target);
                    if (creep.memory.path.length > 3) {
                        creep.memory.path.splice(-3);
                    }
//                    console.log("Maintain: Finding Path " + creep.memory.path.length);
//                    creep.moveTo(target);
                }
                else if (res == OK) {
                    creep.say("\u2016");
                    if (target.hits = target.hitsMax) {
                        creep.memory.target = null;
                    }
                }
                else
                    creep.say("Rep:Tar:" + res);
            }
            else {
                // Find Target
                var roads = creep.room.find(FIND_STRUCTURES,
                    { filter: { structureType: STRUCTURE_ROAD } }
                );
                if (roads.length) {
                    roads = roads.sort(function (a, b) { return (a.hits - b.hits); });
                    // Then try structures
                    if (roads[0].hits < 4500) {
                        creep.memory.target = roads[0].id;
                    }
                    else {
                        creep.memory.role = "worker";
                        creep.memory.job = null;
                        creep.memory.target = null;
                    }
                }
                else {
                    creep.say("waiting");
                }
            }
        }
    }
};

module.exports = roleMaintainer