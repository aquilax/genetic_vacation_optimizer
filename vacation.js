var Vacation = (function(){

  var generations = [];

  var conf = {
    year: 0,
    isLeap: false,
    yearDays: 365,
    vacationDays: 20,
    firstDay: 0,
    individualsInGen: 20,
    generations: 10,
    random_select: 0.05,
    retain: 0.2,
    mutate: 0.01
  };
  
  //Day of year to day of week
  function DoyToDow(year, doy){
    var start = new Date(year, 0, 1, 12, 0, 0).getTime();
    var end = new Date();
    end.setTime((doy * 86400000) + start);
    return end.getDay();
  }

  function init(config){
    d = new Date();
    conf.year = d.getFullYear();
    
    conf = $.extend(conf, config);  
    conf.isLeap = new Date(conf.year, 1, 29).getDate() == 29;
    conf.yearDays = conf.isLeap?366:365;
    conf.firstDay = new Date(conf.year, 0, 1).getDay(); // Jan 1st
  }

  function blankIndividual(){
    var ind = [];
    for (var i = 0; i < conf.yearDays; i++){
      switch(DoyToDow(conf.year, i)){
        case 6:ind[i] = 1;break; //Saturday
        case 0:ind[i] = 2;break; //Sunday
        default:ind[i] = 0;
      }
    }
    return ind;
  }

  function fitness(individual){
    var groups = {};
    var ing = 0;
    for (i in individual) {
      if (individual[i]){
        ing++;
      } else {
        if (ing) {
          if (typeof(groups[ing]) !== "undefined"){
            groups[ing] = groups[ing] + 1;
          } else {
            groups[ing] = 1;
          }
          ing = 0
        }
      }
    }
    if (ing) {
      if (typeof(groups[ing]) !== "undefined"){
        groups[ing] = groups[ing] + 1;
      } else {
        groups[ing] = 1;
      }
    }
    var result = 0;
    for (k in groups){
      result += Math.pow(groups[k], k);
    }
    return result;
  }

  function rand(min, max){
    return min + Math.floor(Math.random() * (max - min))
  }

  function individual(){
    var g = blankIndividual();
    var days = conf.vacationDays;
    while (days > 0) {
      var d = rand(0, conf.yearDays-1);
      if (!g[d]) {
        g[d] = 3
        days--;
      }
    }
    return g;
  }
    
  function population(individuals) {
    var population = [];
    for (var i = 0; i < individuals; i++){
      var ind = individual()
      population[i] = {
        v: ind,
        grade: fitness(ind)
      };
    }
    return population;
  }
  
  function mutate(individual){
    //TODO: Mutate
    return individual;
  }
  
  function sex(father, mother){
    //TODO: Do the sexy thing
    return mother;
  }
  
  function evolve(generation) {
    var retain_length = Math.floor(generation.length * conf.retain);
    var parents = [];
    for (var i = 0; i < retain_length; i++){
      parents.push(generation[i]);
    }
    for (i = retain_length; i < conf.individualsInGen; i++){
      if (conf.random_select > Math.random()){
        parents.push(generation[i]);
      }
    }
    for (var i in parents){
      if (conf.mutate > Math.random()){
        var mutant = mutate(parents[i]);
        parents[i] = {
          v: mutant,
          grade: fitness(mutant)
        };
      }
    }
    while (parents.length < conf.individualsInGen){
      male = rand(0, parents.length);
      female = rand(0, parents.length);
      if (male != female){
        var child = sex(parents[male], parents[female]);
        parents.push({
          v: child,
          grade: fitness(child)
        });
      }
    }
    return parents;
  }
  
  function run(){
    generation = population(conf.individualsInGen);
    for (var i = 0; i < conf.generations; i++){
      generation.sort(function (a, b){return b.grade - a.grade;});
      console.log(generation[0].grade);
      generation = evolve(generation);
    }
    generation.sort(function (a, b){return b.grade - a.grade;});
    document.write(generation[0].v);
    console.log(generation[0].grade);
  }
  
  return {
    init: init,
    run: run
  }
}());

conf = {
  year: 2011
}
Vacation.init(conf);
Vacation.run();