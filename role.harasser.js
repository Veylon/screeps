function checkIfBlocked(pos, indir) {
    var dir = indir;
    var newpos = pos;
    if (dir <= 0) {
        dir = dir + 8;
    }
    else if (dir > 8){
        dir = dir - 8;
    }
    switch (dir) {
        case TOP:
            newpos.y--;
            break;
        case TOP_LEFT:
            newpos.y--;
            newpos.x--;
            break;
        case LEFT:
            newpos.x--;
            break;
        case BOTTOM_LEFT:
            newpos.x--;
            newpos.y++;
            break;
        case BOTTOM:
            newpos.y++;
            break;
        case BOTTOM_RIGHT:
            newpos.y++;
            newpos.x--;
            break;
        case RIGHT:
            newpos.x--;
            break;
        case TOP_RIGHT:
            newpos.x--;
            newpos.y--;
            break;
    }
    var look = newpos.look();
    look.forEach(function (lookObject) {
        if (lookObject.type == "creep") {
            console.log(pos + " blocked going to " + newpos + " via " + dir);
            return true;
        }
        else if (lookObject.type == "terrain") {
            if (lookObject.terrain == 'plain') {
                console.log(pos + " free going to " + newpos + " via " + dir);
                return false;
            }
            else {
                console.log(pos + " blocked going to " + newpos + " via " + dir);
                return true;
            }

        }
    });
    return false;
};

function push(creep, dir)
{

};


var roleHarasser = {
    /*
        Move towards enemy until distance  = 3
        Fire at distance  = 3
        Move away if distance = 2
        Renew and return if no enemies
    */




    /** @param {Creep} creep **/
    run: function (creep) {
        if (creep.memory.job = "patrol") {
            if (creep.hits < creep.hitsMax / 2) {
                creep.memory.renew = true;
            }
            // Find a red flag
            for (var name in Game.flags) {
                var flag = Game.flags[name];
                if (flag.color == COLOR_RED) {
                    if (creep.room.name != flag.pos.roomName && !creep.memory.renew) {
//                        console.log("Moving towards flag");
                        creep.moveTo(flag.pos);
                    }
                    else {
                        // In red flag room
                        // Find nearest enemy
                        var target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                        if (!target || creep.memory.renew == true) {
                            if (creep.ticksToLive < 200 || creep.hits < creep.hitsMax || creep.memory.renew == true) {
                                //console.log(creep.name + " Renewing");
                                creep.memory.renew = true;
                                /*
                                var res = Game.spawns.Spawn1.renewCreep(creep);
                                if (res == ERR_NOT_IN_RANGE) {
                                    creep.moveTo(Game.spawns.Spawn1);
                                }
                                if (creep.ticksToLive > 1400) {
                                    creep.memory.renew = false;
                                }
                                return;
                                */
                            }
                            else {
                                if (creep.pos.getRangeTo(flag.pos) < 10) {
                                    creep.move(Math.floor(Math.random() * 8) + 1);
                                }
                                else
                                {
                                    creep.moveTo(flag.pos);
                                }
                            }
                        }
                        else
                        {
                            // We have a target
                            var dist = creep.pos.getRangeTo(target);
                            var dir = creep.pos.getDirectionTo(target);
                            console.log(creep.name +" " +dist);
                            if (dist <= 3)
                            {
                                // Too close. Move away
                                // Find dirction
                                // Make the opposite
                                dir = dir - 4;
                                if (dir <= 0) {
                                    dir = dir + 8;
                                }
                                creep.rangedAttack(target);
                                if (!checkIfBlocked(creep.pos, dir)) {
                                    creep.move(dir);
                                }
                                else if (!checkIfBlocked(creep.pos, dir - 1)) {
                                    if (dir - 1 <= 0) {
                                        creep.move(dir - 1 + 8);
                                    }
                                    else {
                                        creep.move(dir - 1);
                                    }
                                }
                                else if (!checkIfBlocked(creep.pos, dir + 1)) {
                                    if (dir + 1 > 8) {
                                        creep.move(dir + 1 - 8);
                                    }
                                    else {
                                        creep.move(dir + 1);
                                    }
                                }
                                else if (!checkIfBlocked(creep.pos, dir - 2)) {
                                    if (dir - 2 <= 0) {
                                        creep.move(dir - 2 + 8);
                                    }
                                    else {
                                        creep.move(dir - 2);
                                    }
                                }
                                else if (!checkIfBlocked(creep.pos, dir + 2)) {
                                    if (dir + 2 > 8) {
                                        creep.move(dir + 2 - 8);
                                    }
                                    else {
                                        creep.move(dir + 2);
                                    }
                                }


                                console.log(creep.name + " Retreating");
                            }
                            else
                            {
                                if (creep.pos.findInRange(FIND_MY_CREEPS, 2).length > 3)
                                {
                                    // conngested. To to spread out
                                    if (Math.random() > 0.5) {
                                        dir+=2;
                                    }
                                    else {
                                        dir-=2;
                                    }
                                    if (dir <= 0) {
                                        dir += 8;
                                    }
                                    else if (dir > 8) {
                                        dir -= 8
                                    }
                                    creep.move(dir);
                                }
                                // Far away. Move in
                                creep.moveTo(target);
                                console.log(creep.name + " Advancing");
                            }
                        }
                    }
                }

            }
        }
    }
};

module.exports = roleHarasser;