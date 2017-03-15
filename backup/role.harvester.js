var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
	    if(creep.carry.energy < creep.carryCapacity) {
            var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
        else {
            var hastarget = false;
            for(var name in Game.spawns){
                var sp = Game.spawns[name];
                if(sp.energy < sp.energyCapacity)
                {
                    hastarget = true;
                    if(creep.transfer(sp, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                    {
                        creep.moveTo(sp);
                    }
                }
            }
        }
	}
};

module.exports = roleHarvester;