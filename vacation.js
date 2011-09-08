var Vacation = (function(){

  var conf = {
    year: 0,
    isLeap: false,
    yearDays: 365,
    vacationDays: 20,
    firstDay: 0
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

  function blankGeneration(){
    var gen = [];
    for (var i = 0; i < conf.yearDays; i++){
      switch(DoyToDow(conf.year, i)){
        case 0: gen[i] = false; break; //Sunday
        case 6: gen[i] = false; break; //Saturday
        default: gen[i] = true;
      }
    }
    return gen;
  }

  function individual(){
    var g = blankGeneration();
  }
  
  function run(){
    individual();
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