var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.upgrading && creep.carry.energy == 0) {
            creep.memory.upgrading = false;
            creep.say('Refill');
	    }
	    if(!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.upgrading = true;
	        creep.say('Build');
	    }

	    if(creep.memory.upgrading) {
	        var sites = creep.room.find(FIND_MY_CONSTRUCTION_SITES);
	        if(sites.length > 0)
	        {
	            if(creep.build(sites[0]) == ERR_NOT_IN_RANGE)
                    creep.moveTo(sites[0]);
            }
            else
            {
                creep.suicide();
            }
        }
        else {
            var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
	}
};

module.exports = roleBuilder