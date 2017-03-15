var roleTower = {

	/** @param {Creep} creep **/
	run: function (tower) {
		if (tower.energy > 0)
        {
            var enemies = tower.room.find(FIND_CREEPS, { filter: { my: false } });
            if (enemies.length) {
                enemies = enemies.sort(function (a, b) { return a.hits - b.hits; });
                tower.attack(enemies[0]);
            }
            else {
                var creeps = tower.room.find(FIND_MY_CREEPS, {
                    filter: function (a) {
                        return (a.hits < a.hitsMax);
                    }
                });
                if (creeps.length) {
                    creeps = creeps.sort(function (a, b) { return (a.hits - b.hits); });
                    tower.heal(creeps[0]);
                }
                else {
                    var structs = tower.room.find(FIND_STRUCTURES, {
                        filter: function (a) {
                            return (a.hits < a.hitsMax && a.hits < 3000);
                        }
                    });
                    structs = structs.sort(function (a, b) { return (a.hits - b.hits); });
                    var res = tower.repair(structs[0]);
                }
            }
		}
	}
};

module.exports = roleTower