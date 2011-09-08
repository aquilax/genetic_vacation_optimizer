var Vacation = (function(){

  var generations = [];

  var conf = {
    year: 0,
    isLeap: false,
    yearDays: 365,
    vacationDays: 20,
    firstDay: 0,
    individualsInGen: 20,
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
        case 0: ind[i] = false; break; //Sunday
        case 6: ind[i] = false; break; //Saturday
        default: ind[i] = true;
      }
    }
    return ind;
  }

  function fitness(individual){
    var groups = {};
    var ing = 0;
    for (i in individual) {
      if (!individual[i]){
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
      if (g[d]) {
        g[d] = false
        days--;
      }
    }
    return g;
  }
  
  function population(individuals){
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
  
  function run(){
    generations[0] = population(conf.individualsInGen);
  }
  
  return {
    init: init,
    run: run,
  }
}());

conf = {
  year: 2011
}
Vacation.init(conf);
Vacation.run();