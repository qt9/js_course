

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function Battleground() {
  this.round = 1;
  this.robots = [];
  this.aliveCount = 0;
}

Battleground.prototype.addRobot = function(robot){
  this.robots.push(robot);
};

Battleground.prototype.someRobot = function(activeRobot){
  var damagedRobot;
  do{
    damagedRobot = rand(0, this.robots.length-1);
  } while(damagedRobot == activeRobot || !this.robots[damagedRobot].alive)
  return damagedRobot;
};

Battleground.prototype.updateAliveStatus = function (robot){
  if(!robot.alive){
    this.aliveCount--;
    console.log(robot.name + " погиб ;-(");
  }
};

Battleground.prototype.roundComments = function(activeRobot){
  console.log('Раунд ' + this.round);
  console.log(activeRobot.name + " атаковал с силой " + activeRobot.weapon.power + " тип урона " + activeRobot.weapon.type);
};

Battleground.prototype.areaDamage = function (activeRobot){
  for (var j = 0; j < this.robots.length; j++){
    if(activeRobot != this.robots[j] && this.robots[j].alive) {
      activeRobot.attack(this.robots[j]);
      this.updateAliveStatus(this.robots[j]);
    }
  }
};

Battleground.prototype.singleDamage = function (activeRobot){
  var someRobot = this.someRobot(this.robots.indexOf(activeRobot));
  activeRobot.attack(this.robots[someRobot]);
  this.updateAliveStatus(this.robots[someRobot]);
};

Battleground.prototype.actionDuringRound = function(activeRobot){

  if(activeRobot.alive){
    this.roundComments(activeRobot);
    if (activeRobot.weapon.type == 'по области') {
      this.areaDamage(activeRobot);
    } else {
      this.singleDamage(activeRobot);
    }
    this.round++;
  }
};

Battleground.prototype.startBattle = function(){
  this.aliveCount = this.robots.length;
  while (this.aliveCount > 1) {
    for (var i = 0; i < this.robots.length; i++) {
      this.actionDuringRound(this.robots[i]);
    }
  }
  var aliveRobot = this.robots.filter(function(robot){
    return robot.alive;
  })[0];
  console.log(aliveRobot.name + "  Win! ;-) ");
};

Battleground.prototype.size = function(){
  return this.robots.length;
};

function Robot(name) {
  this.name = name;
  this.weapon = makeWeapon();
  this.alive = true;
  this.health = rand(20, 50);
}

Robot.prototype.receiveDamage = function(points){
  if (this.health - points <= 0){
    this.health = 0;
    this.alive = false;
  } else {
    this.health -= points;
  }
  return this;
};

Robot.prototype.attack = function(otherRobot){
  otherRobot.receiveDamage(this.weapon.power);
  console.log(otherRobot.name + " получил " + this.weapon.power + " очков урона");
};

function makeWeapon(){
  var power = rand(5, 20);
  var type;
  if (rand(1, 2) == 1){
    type = 'по одиночной цели';
  } else {
    type = 'по области';
  }
  return new Weapon(type, power);
}

function Weapon(type, power) {
  this.type = type;
  this.power = power;
}

function makeBattle(robotCount) {
  if(robotCount <= 1 ){
    console.log('Ошибка. Недостаточно роботов для начала битвы.');
  }
  var Battle = new Battleground();
  for (var k = 0; k <robotCount; k++){
    var robot = new Robot('РОБОТ' + (k+1));
    Battle.addRobot(robot);
  }
  return Battle
}

var Battle = makeBattle(10);
Battle.startBattle();
