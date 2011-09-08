var Vacation = (function(){

  var generations = [];

  var conf = {
    year: 0,
    isLeap: false,
    yearDays: 365,
    vacationDays: 20,
    firstDay: 0,
    individualsInGen: 60,
    generations: 40,
    random_select: 0.05,
    retain: 0.2,
    mutate: 0.1,
    mutation_strength: 0.8
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
    var l = individual.length;
    for (var i = 0; i < l; i++) {
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
    for (k in groups) {
      if (k > 2) {
        result += Math.pow(groups[k], k);
      }
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
    return {v: g, grade: fitness(g)};
  }
    
  function population(individuals) {
    var population = [];
    for (var i = 0; i < individuals; i++){
      population[i] = individual();
    }
    return population;
  }
  
  function mutate(individual){
    var mutant = {v: []};
    var mutations = 0;
    var l = individual.v.length;
    for (var d = 0; d < l; d++){
      mutant.v[d] = individual.v[d];
      if (mutant.v[d] == 3 && conf.mutation_strength > Math.random()){
        mutant.v[d] = 0;
        mutations++;
      }
    }
    while (mutations > 0) {
      ndx = rand(0, conf.yearDays);
      if (mutant.v[ndx] == 0){
        mutant.v[ndx] = 3;
        mutations--;
      }
    }
    mutant.grade = fitness(mutant.v);
    return mutant;
  }
  
  function sex(father, mother){
    var child = {v: []};
    var extras = 0;
    var ona = [];
    var l = father.v.length;
    for (var d = 0; d < l; d++){
      child.v[d] = mother.v[d];
      if (father.v[d] == 3) {
        if (mother.v[d] != 3){
          child.v[d] = 3;
          extras++;
        } else if (child.v[d+1] != 3) {
          child.v[d+1] = 3;
        }
      }
      if (child.v[d] == 3){
        ona.push(d);
      }
    }
    while (extras > 0){
      var ndx = rand(0, ona.length-1);
      var el = ona.splice(ndx, 1);
      el = parseInt(el[0]);
      child.v[el] = 0;
      extras--;
    }
    child.grade = fitness(child.v);
    return child;
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
    l = parents.length;
    for (var i = 0; i < l; i++){
      if (conf.mutate > Math.random()){
        parents[i] = mutate(parents[i]);
      }
    }
    var pl = parents.length;
    while (parents.length < conf.individualsInGen){
      var male = rand(0, pl);
      var female = rand(0, pl);
      if (male != female){
        var child = sex(parents[male], parents[female]);
        parents.push(child);
      }
    }
    return parents;
  }
  
  function count3(individual){
    var cnt = 0;
    var l = individual.v.length;
    for(var i = 0; i < l; i++){
      if (individual.v[i] == 3){
        cnt++;
      }
    }
    return cnt;
  }
  
  function print(vals, caption){
    offset = conf.firstDay == 0?6:conf.firstDay-1;
    var t = '<table><tr><caption>'+caption+'</caption>';
    
    for (i = 0; i < offset; i++){
      t += '<td>&nbsp;</td>';
    }
    l = vals.length;
    for (i  = 0; i < l; i++){
      switch(vals[i]){
        case 1: t += '<td style="background-color:#f00">'+i+'</td>'; break;
        case 2: t += '<td style="background-color:#0f0">'+i+'</td>'; break;
        case 3: t += '<td style="background-color:#00f">'+i+'</td>'; break;
        default: t += '<td>'+i+'</td>';
      }
      if ((parseInt(i)+offset+1) % 7 == 0){
        t += "</tr><tr>";
      }
    }
    t += "</tr></table>";
    $('#cont').append("<td>"+t+"</td>");
  }
  
  function run(){
    generation = population(conf.individualsInGen);
    for (var i = 0; i < conf.generations; i++){
      generation.sort(function (a, b){return b.grade - a.grade;});
      print(generation[0].v, i+":"+generation[0].grade);
      generation = evolve(generation);
    }
    generation.sort(function (a, b){return b.grade - a.grade;});
    print(generation[0].v, i+":"+generation[0].grade);
    //document.write(generation[0].v);
    //console.log(generation[0].grade);
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