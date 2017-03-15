var roleWorker = {

    /** @param {Creep} creep **/
    run: function (creep) {

        if (creep.ticksToLive < 50) {
            // Emergency maintenance
            creep.memory.job = null;
        }
        else if (!creep.memory.job) {
            // creep.say("No Job");
            // Find new jov
            if (creep.ticksToLive < 300) {
                // If obsolete, then kill off
                if (creep.body.length <= 4) {
                    creep.suicide();
                }
                else {
                    // Regular maintenance
                    creep.memory.job = "renew";
                    creep.say("\u2665");
                }
            }
            else if (creep.carry.energy == 0)
            {
                var resources = creep.room.find(FIND_DROPPED_ENERGY);
                if (resources.length > 0)
                {
                    console.log(resources);
                    creep.memory.job = "pickup";
                    creep.memory.target = creep.pos.findClosestByRange(resources).id;
                    creep.say("Pickup!");
                }
                else
                
                {
                    // Pick up energy
                    creep.memory.job = "energy";
                    creep.memory.target = null;
                    creep.say("\u26A1")
                }
            }
            else if (creep.carry.energy > 0)
            {
                // Drop off energy
                creep.memory.job = "deliver";
                creep.memory.target = null;
            }
        }            
        else if (creep.memory.job == "pickup")
        {
            var pick = Game.getObjectById(creep.memory.target);
            var res = creep.pickup(pick);
            console.log(creep.name + res);
            if (res == ERR_NOT_IN_RANGE) {
                console.log(creep.name + " PIckup OOR");
                creep.moveTo(pick);
            }
            else if (res != OK)
            {
                console.log(creep.name + " not ok");
                creep.memory.job = null;
                creep.memory.target = null;
            }

        }        
        else if (creep.memory.job == "renew") {
            var res = Game.spawns.Spawn1.renewCreep(creep);
            if (res == ERR_NOT_IN_RANGE) {
                creep.memory.path = creep.pos.findPathTo(Game.spawns.Spawn1);
            }
            if (creep.ticksToLive > 1400) {
                creep.memory.job = null;
//                    creep.say("Renewed!");
            }
        }
        else if (creep.memory.job == "recycle") {
            if (Game.spawns.Spawn1.recycleCreep(creep) == ERR_NOT_IN_RANGE)
                creep.moveTo(Game.spawns.Spawn1);
        }
        else if (creep.memory.job == "energy") {
            if (creep.carry.energy == creep.carryCapacity) {
                creep.memory.job = null;
                var newdir = creep.memory.lastdir + 4;
                if (newdir > 8) { newdir = newdir - 8;}
                creep.move(newdir);
                return;
//                creep.say("Full!");
            }
            else if (creep.memory.target) {
//                creep.say("Trying to Harvest");
                var source = Game.getObjectById(creep.memory.target);
                var res = creep.withdraw(source, RESOURCE_ENERGY);
                if (res == ERR_NOT_IN_RANGE) {
//                    creep.moveTo(source.pos);
                    creep.memory.path = creep.pos.findPathTo(source.pos, {
                        visualizePathStyle: {
                            fill: 'transparent',
                            stroke: '#fff',
                            lineStyle: 'dashed',
                            strokeWidth: .15,
                            opacity: .1
                        }
                    });
//                    creep.say("Moving");
                }
                else if (res == ERR_NOT_ENOUGH_RESOURCES) {
                    creep.job = null;
                }
                else if(res != OK) {
                    creep.say(res);
                }
                    
            }
            else {
                var sources = creep.room.find(FIND_STRUCTURES, {
                    filter: (i) => i.structureType == STRUCTURE_CONTAINER &&
                        i.store[RESOURCE_ENERGY] > 0
                });                if (sources.length > 0) {
                    sources = sources.sort(function (a, b) { return (b.progress - a.progress); });
                    creep.memory.target = sources[0].id;
                }
                if (!sources.length && creep.room != Game.spawns.Spawn1.room)
                {
                    var sources = Game.spawns.Spawn1.room.find(FIND_STRUCTURES, {
                        filter: (i) => i.structureType == STRUCTURE_CONTAINER &&
                            i.store[RESOURCE_ENERGY] > 0
                    }); if (sources.length > 0) {
                        sources = sources.sort(function (a, b) { return (b.progress - a.progress); });
                        creep.memory.target = sources[0].id;
                    }

                }
            }
        }
        else if (creep.memory.job == "deliver") {
            if (creep.carry.energy == 0) {
                // Quit Delivery if no energy
                creep.memory.job = null;
            }
            else if (creep.memory.target) {
                target = Game.getObjectById(creep.memory.target);
                creep.say("\u2609");
                var res = creep.transfer(target, RESOURCE_ENERGY);
                if (res == ERR_NOT_IN_RANGE) {
//                    creep.moveTo(target);
                    creep.memory.path = creep.pos.findPathTo(target, {visualizePathStyle: {
                        fill: 'transparent',
                        stroke: '#fff',
                        lineStyle: 'dashed',
                        strokeWidth: .15,
                        opacity: .1
                    }
                    });
                }
                else if (res == ERR_FULL) {
                    creep.memory.target = null;
                }
                else if (res != OK) {
                    creep.say("Del:Tar:" + res);
                    creep.memory.job = null;
                }
            }
            else {
                // Find Target
                // Keep controller happy
                if (creep.room.controller.my && creep.room.controller.ticksToDowngrade < 3000) {
                    creep.memory.target = creep.room.controller.id;
//                   console.log("Controller");
                }
                // Try Spawns first
                if (creep.memory.target == null) {
                   //  var spawns = creep.room.find(FIND_MY_SPAWNS);
                    if (Game.spawns.Spawn1.energy < Game.spawns.Spawn1.capacity) {
                        creep.memory.target = Game.spawns.Spawn1.id;
//                        console.log("Spawn");
                    }
                }
                // Then try structures
                
                if (creep.memory.target == null) {
                    var structs = creep.room.find(FIND_MY_STRUCTURES, {
                        filter: function (object) {
                            return (object.energy < object.energyCapacity);
                        }
                    });
                    if (structs.length > 0) {
                        var target = creep.pos.findClosestByRange(structs);
                        creep.memory.target = target.id;
                    }
                }
                
                // Then try building in home room
                if (creep.memory.target == null) {
                    var structs = Game.spawns.Spawn1.room.find(FIND_MY_CONSTRUCTION_SITES);
//                    console.log("sites: " + structs);
                    if (structs.length) {
                        // Find most done
                        structs = structs.sort(function (a, b) { return (b.progress - a.progress); });
                        creep.memory.job = "build";
                        if (structs[0].progress == 0) {
                            // Choose one at random
                            creep.memory.target = structs[Math.floor(Math.random() * structs.length)].id;
                        }
                        else {
                            // Go with most progressed building
                            creep.memory.target = structs[0].id;
                        }
//                        creep.say("Build!");
                        creep.say("\u2692");
                    }
                }
                // Try building in other rooms
                for (var name in Game.flags) {
                    var flag = Game.flags[name];
                    if (flag.color == COLOR_BLUE) {
                        var room = Game.rooms[flag.pos.roomName];
                        if (room)
                        {
                            var enemies = room.find(FIND_HOSTILE_CREEPS);
                            if (enemies.length) {
                                continue;
                            }
                            var structs = Game.rooms[flag.pos.roomName].find(FIND_MY_CONSTRUCTION_SITES);
                            //                    console.log("sites: " + structs);
                            if (structs.length) {
                                // Find most done
                                structs = structs.sort(function (a, b) { return (b.progress - a.progress); });
                                creep.memory.job = "build";
                                if (structs[0].progress == 0) {
                                    // Choose one at random
                                    creep.memory.target = structs[Math.floor(Math.random() * structs.length)].id;
                                }
                                else {
                                    // Go with most progressed building
                                    creep.memory.target = structs[0].id;
                                }
                                //                        creep.say("Build!");
                                creep.say("\u2692");
                            }
                        }                        
                    }
                }
                // Deliver to controller if nothing else to do
                if (creep.memory.target == null) {
                    var flags = creep.room.controller.pos.look(LOOK_FLAGS);
                    if (flags.length) {
                        console.log("Controller Flag: " + flags[0].name)
//                        creep.memory.target = creep.room.controller.id;
                        creep.say("\u2654\u2304");
                    }
                }
            }
        }        
        else if (creep.memory.job == "build") {
            if (creep.carry.energy == 0 || !creep.memory.target) {
                // Quit Delivery if no energy
                creep.memory.job = null;
            }
            else {
                var target = Game.getObjectById(creep.memory.target);
//                console.log(target);
                var res = creep.build(target);
                if (res == ERR_NOT_IN_RANGE) {
//                    creep.moveTo(target);
                    creep.memory.path = creep.pos.findPathTo(target);
                    if (creep.memory.path.length > 3) {
                        creep.memory.path.splice(-3);
                    }
                }
                else if (res == ERR_INVALID_TARGET) {
                    creep.memory.target = null;
                }
                else if (res != OK) {
                    creep.say("BLD:"+res)
                }
            }            
        }
	}
};

module.exports = roleWorker