var roleWorker = require('role.worker');
var roleMaintainer = require('role.maintainer');
var roleAttacker = require('role.attacker');
var roleHauler = require('role.hauler');
var roleMiner = require('role.miner');
var roleScout = require('role.scout');
var roleHarasser = require('role.harasser');
var roleBlob = require('role.blob');

var roleTower = require('role.tower');

module.exports.loop = function () {
    var home = Game.spawns["Spawn1"];
    var harasscount = 0;
    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        if (creep.memory.job == "deliver" && creep.memory.target) {
            var target = Game.getObjectById(creep.memory.target);
            if (target.energy == target.energyCapacity) {
                creep.target = null;
                creep.path = null;
            }
        }
        if (creep.memory.path && creep.memory.path.length > 0) {
//            console.log("Trying Path");
            var direction = creep.memory.path[0].direction;
            var res = creep.move(direction);
            if (res == OK) {
//                console.log("Okay" + creep.memory.path.length);
                creep.memory.path.shift();
                creep.memory.lastdir=direction;
//                console.log("Okay" + creep.memory.path.length);
            }
            else if (res != ERR_TIRED) {
//                console.log("not tired");
                creep.say(res);
                creep.memory.path = null;
            }
        }
        else {
            if (creep.memory.role == 'worker') {
                roleWorker.run(creep);
            }
            else if (creep.memory.role == 'hauler') {
                roleHauler.run(creep);
            }
            else if (creep.memory.role == 'miner') {
                roleMiner.run(creep);
            }
            else if (creep.memory.role == 'maintainer') {
                roleMaintainer.run(creep);
            }
            else if (creep.memory.role == 'attacker') {
                roleAttacker.run(creep);
            }
            else if (creep.memory.role == 'scout') {
                roleScout.run(creep);
            }
            else if (creep.memory.role == 'blob') {
                roleBlob.run(creep);
            }
            else if (creep.memory.role == 'harasser') {
                creep.memory.job = "patrol";
                roleHarasser.run(creep);
                harasscount++;
            }
        }
    }
//    console.log("H: " + harasscount++);
    var towers = home.room.find(FIND_STRUCTURES, { filter: { structureType: STRUCTURE_TOWER } });
    towers.forEach(function(tower) {
        roleTower.run(tower);
    });
    /*
    if (Object.keys(Game.creeps).length < 24) {
        var res = Game.spawns["Spawn1"].createCreep([WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], null, { role: "worker" });
    }
    */
    if (harasscount < 12) {
        var res = Game.spawns["Spawn1"].createCreep([RANGED_ATTACK, RANGED_ATTACK, MOVE, MOVE], null, { role: "harasser" });
    }

    // Renewing
    var renewals = Game.spawns.Spawn1.pos.findInRange(FIND_MY_CREEPS);
    if (renewals.length) {
        renewals = renewals.sort(function (a, b) { return (a.ticksToLive - b.ticksToLive); });
        Game.spawns.Spawn1.renewCreep(renewals[0]);
    }
}