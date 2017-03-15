var roleHauler = {

    /** @param {Creep} creep **/
    run: function (creep) {
        console.log(creep.name + "Hauler");
        if (creep.ticksToLive < 200 || creep.memory.renew == true) {
            creep.memory.renew = true;
            switch (Game.spawns.Spawn1.renewCreep(creep)) {
                case ERR_NOT_IN_RANGE:
                    creep.memory.path = creep.pos.findPathTo(Game.spawns.Spawn1);
                    break;
            }
            if (creep.ticksToLive > 1400) {
                creep.memory.renew = false;
            }
            return;
        }
        if (creep.memory.job == "setup")
        {
            creep.memory.outputs = [];
            creep.memory.inputs = [];
            console.log("Setting Up");
            for (var name in Game.flags) {
                console.log(name);
                var flag = Game.flags[name];
                if (flag.color == COLOR_ORANGE) {
                    flag.pos.lookFor(LOOK_STRUCTURES).forEach(function (struct) {
                        if (struct.energyCapacity) {
                            console.log("out " + struct);
                            creep.memory.outputs.push(struct.id);
                            flag.remove();
                        }
                    });
                }
                else if (flag.color == COLOR_YELLOW) {
                    flag.pos.lookFor(LOOK_STRUCTURES).forEach(function (struct) {
                        if (struct.storeCapacity) {
                            console.log("in " + struct);
                            creep.memory.inputs.push(struct.id);
                            flag.remove();
                        }
                    });
                }
            }
            creep.memory.job = null;
        }
        if (creep.carry.energy == 0 || creep.memory.fill) {
            creep.memory.fill = true;
            if (creep.carry.energy == creep.carryCapacity) {
                creep.memory.fill = false;
            }
            if (!creep.memory.target) {
                var structs = [];
//                console.log(creep.memory.inputs);
                if (creep.memory.inputs) {
                    creep.memory.inputs.forEach(function (id) {
                        console.log("id " + id);
                        var struct = Game.getObjectById(id);
                        console.log("struct" + struct);
                        if (struct) {
                            structs.push(struct);
                        }
                    });
                }
                console.log(structs);
                if (structs.length > 0) {
                    console.log(structs);
                    var struct = creep.pos.findClosestByRange(structs);
                    console.log(struct);
                    if (struct)
                    {
                        creep.memory.target = struct.id;
                    }
                }
            }
            if (creep.memory.target) {
//                console.log("2 target = " + creep.memory.target);
                var target = Game.getObjectById(creep.memory.target);
//                console.log("3 target = " + target);
                var res = creep.withdraw(target, RESOURCE_ENERGY);
                if (res == ERR_FULL) {
                    creep.memory.target = null;
                }
                else if (res == ERR_NOT_IN_RANGE) {
                    creep.memory.path = creep.pos.findPathTo(target.pos);
                }
                else
                {
                    creep.memory.target = null;
                }
            }
        }
        if (creep.carry.energy > 0) {
            if (!creep.memory.target) {
                /*
                var structs = [];
                for (var i = 0; i < structs.length; i++) {
                     console.log(structs[i]);
                    var struct = Game.getObjectById(structs[i]);
                    console.log(id + ":" + struct);
                    if(!struct) {
                        console.log(creep.name + " struct undefined " + id);
                    }
                    else if (struct.energy < struct.energyCapacity) {
                        structs.push(struct);
                    }
                    else if (struct.store[RESOURCE_ENERGY] < struct.storeCapacity) {
                        structs.push(struct);
                    }
                }
                structs = structs.sort(function (a, b) { return (a.energy - b.energy); });
                if (structs.length) {
                    creep.memory.target = structs[0].id;
                }
                */
                var extensions = Game.spawns.Spawn1.room.find(FIND_MY_STRUCTURES, {
                    filter: { structureType: STRUCTURE_EXTENSION, energy: 0 }
                });
                if (extensions.length) {
                    creep.memory.target = creep.pos.findClosestByRange(extensions).id;
                }
            }
            if (creep.memory.target) {
                var target = Game.getObjectById(creep.memory.target);
                var res = creep.transfer(target, RESOURCE_ENERGY);
                if (res == ERR_FULL) {
                    creep.memory.target = null;
                }
                else if (res == ERR_NOT_IN_RANGE) {
                    creep.memory.path = creep.pos.findPathTo(target.pos);
                }
                else {
                    creep.memory.target = null;
                }
            }
        }
    }
};

module.exports = roleHauler;