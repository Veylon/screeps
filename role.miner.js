var roleMiner = {

    /** @param {Creep} creep **/
    run: function (creep) {
//        console.log("Miner " + creep.name);
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
        if (!creep.memory.source || !creep.memory.store) {
            return;
        }
        if (creep.carry.energy < creep.carryCapacity) {
//            console.log("Low Energy");
            var source = Game.getObjectById(creep.memory.source);
            switch(creep.harvest(source))
            {
                case ERR_NOT_IN_RANGE:
                    // Get distance to store
                    var store = Game.getObjectById(creep.memory.store);
//                    console.log(store);
                    if (creep.pos.inRangeTo(store, 1)) {
//                        console.log("Moving Toward Source");
                        creep.moveTo(source);
                    }
                    else {
//                        console.log("Moving Toward Store for Source");
                        creep.moveTo(store);
                    }
            }
        }
        if (creep.carry.energy == creep.carryCapacity) {
//            console.log("High Energy");
            var store = Game.getObjectById(creep.memory.store);
            switch (creep.transfer(store, RESOURCE_ENERGY)) {
                case ERR_NOT_IN_RANGE:
//                    console.log("Moving Toward Store");
                    creep.moveTo(store);
            }

        }
    }
};

module.exports = roleMiner;