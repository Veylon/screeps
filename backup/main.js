var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');

module.exports.loop = function () {
    var home = Game.spawns["Home"];
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
//        console.log(name + ":" + creep.memory.role);
        if(creep.memory.role == 'worker') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
    }
    var sites = home.room.find(FIND_MY_CONSTRUCTION_SITES);
    if(sites.length > 0)
    {
        if(home.canCreateCreep([WORK,WORK,CARRY,MOVE]) == OK)
        {
            home.createCreep([WORK,WORK,CARRY,MOVE], null, {role: "builder"});
        }
    
    }
}