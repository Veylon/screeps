var roleBlob = {

    /** @param {Creep} creep **/
    run: function (creep) {
        //                console.log(creep.name + " Scout");
        if (creep.memory.renew == true) {
            creep.memory.renew = true;
            var res = Game.spawns.Spawn1.renewCreep(creep);
            if (res == ERR_NOT_IN_RANGE) {
                creep.moveTo(Game.spawns.Spawn1);
            }
            if (creep.ticksToLive > 1400) {
                creep.memory.renew = false;
            }
        }
        else {
            for (var name in Game.flags) {
                var flag = Game.flags[name];

                if (flag.color == COLOR_RED) {
                    if (creep.room.name != flag.pos.roomName && !creep.memory.renew) {
                        creep.moveTo(flag.pos);
                    }
                    else {
                        var target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                        if (target) {
                            creep.attack(target);
                            creep.moveTo(target);
                        }
                        else if (creep.ticksToLive < 300 || creep.hits < creep.hitsMax) {
                            // Allow renew if no enemies
                            creep.memory.renew = true;
                        }
                        else if (creep.pos.getRangeTo(flag) > 10) {
                            // Move to flag if far
                            creep.moveTo(flag);
                        }
                        else {
                            // Move at random if near
//                            creep.move(Math.floor(Math.random() * 8) + 1);
                        }

                    }
                }
            }
        }
    }
};

module.exports = roleBlob;