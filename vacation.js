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
    return 0;
  }

  function individual(){
    var g = blankIndividual();
  }
  
  function population(individuals){
    var population = [];
    for (var i = 0; i < individuals; i++){
      population[i] = individual();
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