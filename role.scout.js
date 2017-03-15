var roleScout = {

    /** @param {Creep} creep **/
    run: function (creep) {
//                console.log(creep.name + " Scout");
        if (creep.ticksToLive < 200 || creep.memory.renew == true) {
            creep.memory.renew = true;
            var res = Game.spawns.Spawn1.renewCreep(creep);
//            console.log(creep.name + res);
            if (res == ERR_NOT_IN_RANGE) {
                creep.moveTo(Game.spawns.Spawn1);
            }
            else if (res == ERR_FULL) {
                creep.memory.renew = false;
            }
            if (creep.ticksToLive > 1400) {
                creep.memory.renew = false;
            }
        }
        else {
//            console.log(creep.name + " scouting ");
            if (creep.memory.flagName) {
                var flag = Game.flags[creep.memory.flagName];
                if (flag)
                {
                    creep.moveTo(flag);
                }
                else {
                    creep.memory.flagName == null;
                }
            }
            else {
                console.log(creep.name + " finding flag");
                for (var name in Game.flags) {
                    var flag = Game.flags[name];
                    if (flag.color == COLOR_BLUE) {
                        var other = Game.getObjectById(flag.memory.scout);
                        if (!other) {
                            // Clear out dead scouts
                            flag.memory.scout = null;
                        }

                        if (!flag.memory.scout) {
                            creep.memory.flagName = flag.name;
                            flag.memory.scout = creep.id;
                            break;
                        }
                    }
                }
            }
        }
    }
};

module.exports = roleScout;