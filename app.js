//funkcija za ispis Z0
function ispisiZl(){
  var rl = document.getElementById("rl").value;
  var xl = document.getElementById("xl").value;
  //ako je xl pozitivan
  if (xl >= 0)
    document.getElementById("zl").innerHTML = "Z<sub>L</sub> = <span id='zlComplex'>" + rl + "+j" + xl + "</span> &Omega;";
  else
  //negativan
    document.getElementById("zl").innerHTML = "Z<sub>L</sub> = <span id='zlComplex'>" + rl + "-j" + -xl + "</span> &Omega;";
}

//funkcija za validaciju
function validacija(){
  //provjeri sve textboxove
  var z0 = parseFloat(document.getElementById("z0").value);
  var rl = parseFloat(document.getElementById("rl").value);
  var xl = parseFloat(document.getElementById("xl").value);
  var f = parseFloat(document.getElementById("f").value);

  //ako je barem jedna od vrijednost NaN vrati false
  if(isNaN(z0) || isNaN(rl) || isNaN(xl) || isNaN(z0) || isNaN(f)){
    alert("Upisite sve BROJCANE vrijednosti");
    return false;
  }
  odaberiKrug();
}

//funkcija za odabir kruga
function odaberiKrug(){
  var rl = parseFloat(document.getElementById("rl").value);
  var z0 = parseFloat(document.getElementById("z0").value);
  //ako je rl > z0 unutar 1+jx kruga
  if(rl > z0) unutarKruga();
  //inace izvan 1+jx kruga
  else izvanKruga();

}

//unutar 1+jx kruga
function unutarKruga(){
  var z0 = parseFloat(document.getElementById("z0").value);
  var rl = parseFloat(document.getElementById("rl").value);
  var xl = parseFloat(document.getElementById("xl").value);
  var f = parseFloat(document.getElementById("f").value);
  //pretvori f u Hz iz MHz
  f = f * 1000000;
  //izracunaj w(omega)
  var w = 2*Math.PI * f;

  //izracunaj X i B
  with(Math){
    var b1 = (xl + sqrt(rl/z0) * sqrt(pow(rl, 2) + pow(xl, 2) - z0 * rl)) / (pow(rl, 2) + pow(xl, 2));
    var b2 = (xl - sqrt(rl/z0) * sqrt(pow(rl, 2) + pow(xl, 2) - z0 * rl)) / (pow(rl, 2) + pow(xl, 2));
    var x1 = (1/b1) + ((xl*z0)/rl) - (z0/(b1*rl));
    var x2 = (1/b2) + ((xl*z0)/rl) - (z0/(b2*rl));

  }

  //prvo rjesenje
  if(b1 > 0 && x1 > 0) var r1 = LC(b1, x1, w);
  else if(b1 > 0 && x1 < 0) var r1 = CC(b1, x1, w);
  else if(b1 < 0 && x1 > 0) var r1 = LL(b1, x1, w);
  else if(b1 < 0 && x1 < 0) var r1 = CL(b1, x1, w);

  //drugo rjesenje
  if(b2 > 0 && x2 > 0) var r2 = LC(b2, x2, w);
  else if(b2 > 0 && x2 < 0) var r2 = CC(b2, x2, w);
  else if(b2 < 0 && x2 > 0) var r2 = LL(b2, x2, w);
  else if(b2 < 0 && x2 < 0) var r2 = CL(b2, x2, w);

  //postavi varijablu krug na unutar kako bi znali sto ispisati
  var krug = "unutar";

  //ispisi rezultat
  ispisiRezultat(r1, r2, krug);

  //izracunaj koef. refleksije gamma
  var gamma = izracunajGamma(r1, r2, krug, z0);

  //iscrtaj gamma na grafu
  crtajGraf(gamma);

}

//izvan 1+jx kruga
function izvanKruga(){
  var z0 = parseFloat(document.getElementById("z0").value);
  var rl = parseFloat(document.getElementById("rl").value);
  var xl = parseFloat(document.getElementById("xl").value);
  var f = parseFloat(document.getElementById("f").value);
  //pretvori f u Hz iz MHz
  f = f * 1000000;

  //izracunaj w(omega)
  var w = 2*Math.PI * f;

  //izracunaj X i B
  with(Math){
    var b1 = (sqrt((z0 - rl) / rl)) / z0;
    var x1 = sqrt(rl * (z0 - rl)) - xl;
    var b2 = - (sqrt((z0 - rl) / rl)) / z0;
    var x2 = - sqrt(rl * (z0 - rl)) - xl;
  }

  //prvo rjesenje
  if(b1 > 0 && x1 > 0) var r1 = LC(b1, x1, w);
  else if(b1 > 0 && x1 < 0) var r1 = CC(b1, x1, w);
  else if(b1 < 0 && x1 > 0) var r1 = LL(b1, x1, w);
  else if(b1 < 0 && x1 < 0) var r1 = CL(b1, x1, w);

  //drugo rjesenje
  if(b2 > 0 && x2 > 0) var r2 = LC(b2, x2, w);
  else if(b2 > 0 && x2 < 0) var r2 = CC(b2, x2, w);
  else if(b2 < 0 && x2 > 0) var r2 = LL(b2, x2, w);
  else if(b2 < 0 && x2 < 0) var r2 = CL(b2, x2, w);

  //postavi varijablu krug na izvan kako bi znali sto ispisati
  var krug = "izvan";

  //ispisi rezultat
  ispisiRezultat(r1, r2, krug);

  //izracunaj koef. refleksije gamma
  var gamma = izracunajGamma(r1, r2, krug, z0);

  //iscrtaj gamma na grafu
  crtajGraf(gamma);

}


//izracuna za LC mrezu
function LC(b, x, w){
  var rez1 = Math.abs(x)/w;
  var rez2 = Math.abs(b)/w;
  var mreza = "LC";

  return [rez1, rez2, mreza];

}

//izracun za CC mrezu
function CC(b, x, w){
  var rez1 = 1/(w*Math.abs(x));
  var rez2 = Math.abs(b)/w;
  var mreza = "CC";

  return [rez1, rez2, mreza];


}

//izracun za LL mrezu
function LL(b, x, w){
  var rez1 = Math.abs(x)/w;
  var rez2 = 1/(w*Math.abs(b));
  var mreza = "LL";

  return [rez1, rez2, mreza];

}

//izracun za CL mrezu
function CL(b, x, w){
  var rez1 = 1/(w*Math.abs(x));
  var rez2 = 1/(w*Math.abs(b));
  var mreza = "CL";

  return [rez1, rez2, mreza];

}


//funkcija za ispis rezultata
function ispisiRezultat(r1, r2, krug){
  var mreza1 = r1[2];
  var mreza2 = r2[2];

  //provjeri je li izvan 1+jx kruga
  if (krug == "unutar"){
    //prvo rijesenje
    //provjeri koja je mreza i ispisi sliku mreze te rezultat
    switch(mreza1){
      case "LC":
        document.getElementById("prvaMreza").innerHTML = "1. rješenje: <br><img src='img/LC_unutar.png'><br> L1=" + (r1[0] * Math.pow(10,9)).toFixed(2) + " nH<br>C1=" + (r1[1] * Math.pow(10,12)).toFixed(2) + " pF";
      break;

      case "CC":
        document.getElementById("prvaMreza").innerHTML = "1. rješenje: <br><img src='img/CC_unutar.png'><br> C1=" + (r1[0] * Math.pow(10,12)).toFixed(2) + " pF<br>C1'=" + (r1[1] * Math.pow(10,12)).toFixed(2) + " pF";
      break;

      case "LL":
        document.getElementById("prvaMreza").innerHTML = "1. rješenje: <br><img src='img/LL_unutar.png'><br> L1=" + (r1[0] * Math.pow(10,9)).toFixed(2) + " nH<br>L1'=" + (r1[1] * Math.pow(10,9)).toFixed(2) + " nH";
      break;

      case "CL":
        document.getElementById("prvaMreza").innerHTML = "1. rješenje: <br><img src='img/CL_unutar.png'><br> C1=" + (r1[0] * Math.pow(10,12)).toFixed(2) + " pF<br>L1=" + (r1[1] * Math.pow(10,9)).toFixed(2) + " nH";
      break;

    }

    //drugo rijesenje
    //provjeri koja je mreza i ispisi sliku mreze te rezultat
    switch(mreza2){
      case "LC":
        document.getElementById("drugaMreza").innerHTML = "2. rješenje: <br><img src='img/LC_unutar.png'><br> L2=" + (r2[0] * Math.pow(10,9)).toFixed(2) + " nH<br>C2=" + (r2[1] * Math.pow(10,12)).toFixed(2) + " pF";
      break;

      case "CC":
        document.getElementById("drugaMreza").innerHTML = "2. rješenje: <br><img src='img/CC_unutar.png'><br> C2=" + (r2[0] * Math.pow(10,12)).toFixed(2) + " pF<br>C2'=" + (r2[1] * Math.pow(10,12)).toFixed(2) + " pF";
      break;

      case "LL":
        document.getElementById("drugaMreza").innerHTML = "2. rješenje: <br><img src='img/LL_unutar.png'><br> L2=" + (r2[0] * Math.pow(10,9)).toFixed(2) + " nH<br>L2'=" + (r2[1] * Math.pow(10,9)).toFixed(2) + " nH";
      break;

      case "CL":
        document.getElementById("drugaMreza").innerHTML = "2. rješenje: <br><img src='img/CL_unutar.png'><br> C2=" + (r2[0] * Math.pow(10,12)).toFixed(2) + " pF<br>L2=" + (r2[1] * Math.pow(10,9)).toFixed(2) + " nH";
      break;

    }
    //prikazi mreze
    document.getElementById("tablicaMreza").style.visibility = "visible";
  }

  //provjeri je li izvan 1+jx kruga
  else if(krug == "izvan"){
    switch(mreza1){
      //prvo rijesenje
      //provjeri koja je mreza i ispisi sliku mreze te rezultat
      case "LC":
        document.getElementById("prvaMreza").innerHTML = "1. rješenje: <br><img src='img/LC_izvan.png'><br> L1=" + (r1[0] * Math.pow(10,9)).toFixed(2) + " nH<br>C1=" + (r1[1] * Math.pow(10,12)).toFixed(2) + " pF";
      break;

      case "CC":
        document.getElementById("prvaMreza").innerHTML = "1. rješenje: <br><img src='img/CC_izvan.png'><br> C1=" + (r1[0] * Math.pow(10,12)).toFixed(2) + " pF<br>C1'=" + (r1[1] * Math.pow(10,12)).toFixed(2) + " pF";
      break;

      case "LL":
        document.getElementById("prvaMreza").innerHTML = "1. rješenje: <br><img src='img/LL_izvan.png'><br> L1=" + (r1[0] * Math.pow(10,9)).toFixed(2) + " nH<br>L1'=" + (r1[1] * Math.pow(10,9)).toFixed(2) + " nH";
      break;

      case "CL":
        document.getElementById("prvaMreza").innerHTML = "1. rješenje: <br><img src='img/CL_izvan.png'><br> C1=" + (r1[0] * Math.pow(10,12)).toFixed(2) + " pF<br>L1=" + (r1[1] * Math.pow(10,9)).toFixed(2) + " nH";
      break;

    }

    //drugo rijesenje
    //provjeri koja je mreza i ispisi sliku mreze te rezultat
    switch(mreza2){
      case "LC":
        document.getElementById("drugaMreza").innerHTML = "2. rješenje: <br><img src='img/LC_izvan.png'><br> L2=" + (r2[0] * Math.pow(10,9)).toFixed(2) + " nH<br>C2=" + (r2[1] * Math.pow(10,12)).toFixed(2) + " pF";
      break;

      case "CC":
        document.getElementById("drugaMreza").innerHTML = "2. rješenje: <br><img src='img/CC_izvan.png'><br> C2=" + (r2[0] * Math.pow(10,12)).toFixed(2) + " pF<br>C2'=" + (r2[1] * Math.pow(10,12)).toFixed(2) + " pF";
      break;

      case "LL":
        document.getElementById("drugaMreza").innerHTML = "2. rješenje: <br><img src='img/LL_izvan.png'><br> L2=" + (r2[0] * Math.pow(10,9)).toFixed(2) + " nH<br>L2'=" + (r2[1] * Math.pow(10,9)).toFixed(2) + " nH";
      break;

      case "CL":
        document.getElementById("drugaMreza").innerHTML = "2. rješenje: <br><img src='img/CL_izvan.png'><br> C2=" + (r2[0] * Math.pow(10,12)).toFixed(2) + " pF<br>L2=" + (r2[1] * Math.pow(10,9)).toFixed(2) + " nH";
      break;

    }
    //prikazi mreze
    document.getElementById("tablicaMreza").style.visibility = "visible";


  }


}

//funkcija za izracun gamma
function izracunajGamma(r1, r2, krug, z0){
  ////pretvori z0 i zl u kompleksne brojeve
  z0 = math.complex(z0, 0);
  var rl = parseFloat(document.getElementById("rl").value);
  var xl = parseFloat(document.getElementById("xl").value);
  var zl = math.complex(rl, xl);

  //dohvati rijesenja
  var r11 = r1[0];
  var r12 = r1[1];
  var mreza1 = r1[2];
  var r21 = r2[0];
  var r22 = r2[1];
  var mreza2 = r2[2];
  //stvori polja za spremanje rezultata
  var rez1 = [];
  var rez2 = [];

  //IZRACUN FREKVENCIJE DO 1500 MHz tj. 1500000000 Hz
  var frekGranica = 1500000000;

  //provjeri je li unutar 1+jx kruga
  if (krug == "unutar"){
    //prvo rijesenje
    //izracun za frekvenciju od 1Hz do 1.5 GHz
    zl = math.pow(zl, -1);
    for(var frek=1; frek<=frekGranica; frek+=1000000){
      var w = 2 * Math.PI * frek;
      //provjeri koja je mreza te recunaj jX i jB
      switch(mreza1){
        case "LC" :
          var jX1 = r11 * w;
          jX1 = math.complex(0, jX1);
          var jB1 = r12 * w;
          jB1 = math.complex(0, jB1);
        break;
        case "CC" :
          var jX1 = -r11 * w;
          jX1 = math.pow(jX1, -1);
          jX1 = math.complex(0, jX1);
          var jB1 = r12 * w;
          jB1 = math.complex(0, jB1);
        break;
        case "LL" :
          var jX1 = r11 * w;
          jX1 = math.complex(0, jX1);
          var jB1 = -r12 * w;
          jB1 = math.pow(jB1, -1);
          jB1 = math.complex(0, jB1);
        break;
        case "CL" :
          var jX1 = -r11 * w;
          jX1 = math.pow(jX1, -1);
          jX1 = math.complex(0, jX1);
          var jB1 = -r12 * w;
          jB1 = math.pow(jB1, -1);
          jB1 = math.complex(0, jB1);
        break;
      }
      //izracunaj zul
      var jB1zl = math.add(jB1, zl);
      jB1zl = math.pow(jB1zl, -1);
      var zul = math.add(jX1, jB1zl);

      //izracunaj gamma
      var gammaBrojink = math.subtract(zul, z0);
      var gammaNazivnik = math.add(zul, z0);
      var gamma = math.divide(gammaBrojink, gammaNazivnik);
      var gammaAbs = math.abs(gamma);
      rez1.push(gammaAbs);
    }
    //drugo rijesenje
    //izracun za frekvenciju od 1Hz do 1.5 GHz
    for(var frek=1; frek<=frekGranica; frek+=1000000){
      var w = 2 * Math.PI * frek;
      //provjeri koja je mreza te recunaj jX i jB
      switch(mreza2){
        case "LC" :
          var jX2 = r21 * w;
          jX2 = math.complex(0, jX2);
          var jB2 = r22 * w;
          jB2 = math.complex(0, jB2);
        break;
        case "CC" :
          var jX2 = -r21 * w;
          jX2 = math.pow(jX2, -1);
          jX2 = math.complex(0, jX2);
          var jB2 = r22 * w;
          jB2 = math.complex(0, jB2);
        break;
        case "LL" :
          var jX2 = r21 * w;
          jX2 = math.complex(0, jX2);
          var jB2 = -r22 * w;
          jB2 = math.pow(jB2, -1);
          jB2 = math.complex(0, jB2);
        break;
        case "CL" :
          var jX2 = -r21 * w;
          jX2 = math.pow(jX2, -1);
          jX2 = math.complex(0, jX2);
          var jB2 = -r22 * w;
          jB2 = math.pow(jB2, -1);
          jB2 = math.complex(0, jB2);
        break;
      }

      //izracunaj zul
      var jB2zl = math.add(jB2, zl);
      jB2zl = math.pow(jB2zl, -1);
      var zul = math.add(jX2, jB2zl);

      //izracunaj gamma
      var gammaBrojink1 = math.subtract(zul, z0);
      var gammaNazivnik1 = math.add(zul, z0);
      var gamma1 = math.divide(gammaBrojink1, gammaNazivnik1);
      var gammaAbs1 = math.abs(gamma1);
      rez2.push(gammaAbs1);
    }

  }

  //provjeri je li izvan 1+jx kruga
  else if (krug == "izvan"){
    //prvo rijesenje
    //izracun za frekvenciju od 1Hz do 1.5 GHz
    for(var frek=1; frek<=frekGranica; frek+=1000000){
      var w = 2 * Math.PI * frek;
      //provjeri koja je mreza te recunaj jX i jB
      switch(mreza1){
        case "LC" :
          var jX1 = r11 * w;
          jX1 = math.complex(0, jX1);
          var jB1 = r12 * w;
          jB1 = math.complex(0, jB1);
        break;
        case "CC" :
          var jX1 = -r11 * w;
          jX1 = math.pow(jX1, -1);
          jX1 = math.complex(0, jX1);
          var jB1 = r12 * w;
          jB1 = math.complex(0, jB1);
        break;
        case "LL" :
          var jX1 = r11 * w;
          jX1 = math.complex(0, jX1);
          var jB1 = -r12 * w;
          jB1 = math.pow(jB1, -1);
          jB1 = math.complex(0, jB1);
        break;
        case "CL" :
          var jX1 = -r11 * w;
          jX1 = math.pow(jX1, -1);
          jX1 = math.complex(0, jX1);
          var jB1 = -r12 * w;
          jB1 = math.pow(jB1, -1);
          jB1 = math.complex(0, jB1);
        break;
      }
      //izracunaj zul
      var jX1zl = math.add(jX1, zl);
      jX1zl = math.pow(jX1zl, -1);
      var zul = math.add(jB1, jX1zl);
      zul = math.pow(zul, -1);

      //izracunaj gamma
      var gammaBrojink = math.subtract(zul, z0);
      var gammaNazivnik = math.add(zul, z0);
      var gamma = math.divide(gammaBrojink, gammaNazivnik);
      var gammaAbs = math.abs(gamma);
      rez1.push(gammaAbs);
    }

    //drugo rijesenje
    //izracun za frekvenciju od 1Hz do 1.5 GHz
    for(var frek=1; frek<=frekGranica; frek+=1000000){
      var w = 2 * Math.PI * frek;
      //provjeri koja je mreza te recunaj jX i jB
      switch(mreza2){
        case "LC" :
          var jX2 = r21 * w;
          jX2 = math.complex(0, jX2);
          var jB2 = r22 * w;
          jB2 = math.complex(0, jB2);
        break;
        case "CC" :
          var jX2 = -r21 * w;
          jX2 = math.pow(jX2, -1);
          jX2 = math.complex(0, jX2);
          var jB2 = r22 * w;
          jB2 = math.complex(0, jB2);
        break;
        case "LL" :
          var jX2 = r21 * w;
          jX2 = math.complex(0, jX2);
          var jB2 = -r22 * w;
          jB2 = math.pow(jB2, -1);
          jB2 = math.complex(0, jB2);
        break;
        case "CL" :
          var jX2 = -r21 * w;
          jX2 = math.pow(jX2, -1);
          jX2 = math.complex(0, jX2);
          var jB2 = -r22 * w;
          jB2 = math.pow(jB2, -1);
          jB2 = math.complex(0, jB2);
        break;
      }
      //izracunaj zul
      var jX2zl = math.add(jX2, zl);
      jX2zl = math.pow(jX2zl, -1);
      var zul = math.add(jB2, jX2zl);
      zul = math.pow(zul, -1);

      //izracunaj gamma
      var gammaBrojink1 = math.subtract(zul, z0);
      var gammaNazivnik1 = math.add(zul, z0);
      var gamma1 = math.divide(gammaBrojink1, gammaNazivnik1);
      var gammaAbs1 = math.abs(gamma1);
      rez2.push(gammaAbs1);
    }

  }
  //vrati 2 rijesenja
  return [rez1, rez2];

}

//funkcija za crtanje grafa
function crtajGraf(data){
  document.getElementById('graph').innerHTML = "";
  //izbrisi graf ukuliko je nacrtan
  d3.select("svg")
       .remove();

  //dohvati rijesenja
  Ydata1 = data[0];
  Ydata2 = data[1];
  var Xdata = d3.range(1500);
  var xy1 = [];
  for(var i=0;i<Xdata.length;i++){
    xy1.push({x:Xdata[i],y:Ydata1[i]});
  }

  var xy2 = [];
  for(var i=0;i<Xdata.length;i++){
    xy2.push({x:Xdata[i],y:Ydata2[i]});
  }


  // definiraj dimenzije grafa
  var m = [20, 20, 50, 80]; // margine
  var w = 745 - m[1] - m[3]; // width
  var h = 400 - m[0] - m[2]; // height

  // X skala za data1 polje od 0-w piksela
  xScale = d3.scale.linear().domain(d3.extent(xy1,function(d) {return d.x;})).range([0, w]);
  // Y skala od 0-1 od 0-h piksela
  yScale = d3.scale.linear().domain([0, 1]).range([h, 0]);

  // funkcija koja pretvara data u x i y tocke
  var line = d3.svg.line()
    .x(function(d,i) { return xScale(d.x);})

    .y(function(d,i) { return yScale(d.y);})

    // dodaj SVG element za zeljenim marginama
    var graph = d3.select("#graph").append("svg:svg")
          .attr("width", w + m[1] + m[3])
          .attr("height", h + m[0] + m[2])
        .append("svg:g")
          .attr("transform", "translate(" + m[3] + "," + m[0] + ")");

    // stvori x os
    var xAxis = d3.svg.axis().scale(xScale).tickSize(-h).tickSubdivide(true);
    // dodaj x os
    graph.append("svg:g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + h + ")")
          .call(xAxis)
        //dodaj x labelu
        .append("text")
          .attr("x", w / 2)
          .attr("y", m[2] - 25)
          .attr("dy", ".45em")
          .style("text-anchor", "end")
          .text("f(MHz)");

    // stvori y os
    var yAxisLeft = d3.svg.axis().scale(yScale).ticks(4).orient("left");
    // dodaj y os
    graph.append("svg:g")
          .attr("class", "y axis")
          .attr("transform", "translate(-25,0)")
          .call(yAxisLeft)
        //dodaj y labelu
        .append("text")
          //.attr("transform", "rotate(-90)")
          .attr("x", -h/2)
          .attr("y", -m[2])
          .attr("dx", "8em")
          .attr("dy", "14em")
          .style("text-anchor", "end")
          .text("|\u0393|");

      //iscrtaj 2 linije za 2 rijsenja
      graph.append("svg:path")
        .attr("d", line(xy1))
        .attr("id", "myPath1")
        .attr('stroke', '#47A3FF')
        //prikaz vrijednosti na grafu
        .on("mousemove", mMove1)
        .append("title");

      graph.append("svg:path")
        .attr("d", line(xy2))
        //.attr('stroke', 'red')
        //isprekidana linija
        .style("stroke-dasharray", ("7, 3"))
        .attr("id", "myPath2")
        .attr('stroke', '#FF4747')
        //prikaz vrijednosti na grafu
        .on("mousemove", mMove2)
        .append("title");

      //prostor za legendu
      var legendSpace = w/xy1.length;

      //legenda prvog rijesenja
      graph.append("text")
            .attr("x", (legendSpace/2)+legendSpace + 135 )
            .attr("y", h + (m[2]/2)+ 21)
            .attr("class", "legend")
            .style("fill", '#47A3FF')
            .text("1. rješenje \u2014");

      //legenda drugog rjesenja
      graph.append("text")
            .attr("x", (legendSpace/2)+legendSpace + 390 )
            .attr("y", h + (m[2]/2)+ 21)
            .attr("class", "legend")
            .style("fill", '#FF4747')
            .text("2. rješenje - - -");

      //prikazi bandwidth
      document.getElementById("bandwidth").style.visibility = "visible";

      //funkcije koje prikazuju vrijednosti na krivulji pomakom misa
      function mMove1(){
         var title = d3.mouse(this);
         d3.select("#myPath1").select("title").text((yScale.invert(title[1])).toFixed(3));
      }


      function mMove2(){
         var title = d3.mouse(this);
         d3.select("#myPath2").select("title").text((yScale.invert(title[1])).toFixed(3));
      }

    //ako je izracun bandwidtha prikazan -> refresh
    if ((typeof(isBandwidth) !== 'undefined') && (isBandwidth == true)){
      izracunajBandwidth();
    }

}

//funkcija za izracun bandwidtha
function izracunajBandwidth(){
  //varijable za spremanje frekvencije
  var f1 = [];
  var f2 = [];
  //pomocna varijabla
  var flag = false;
  //uzmi gamma
  var gamma = parseFloat(document.getElementById("bandwidthNum").value);
  //zaokruzi gamma na 2 decimale
  gamma = gamma.toFixed(2);
  //prođi kroz polje rjesenja i ako je jednako gamma i flag je false spremi rjesenje u polje i postavi flag na true
  for (var i=0; i<Ydata1.length; i++){
    if(Ydata1[i].toFixed(2) == gamma && flag == false){
      f1.push(i);
      flag = true;
    }
    //ukoliko nije jednako gamma postavi flag na false
    else if(Ydata1[i].toFixed(2) != gamma) {
      flag = false;
    }
  }
  //prođi kroz polje rjesenja i ako je jednako gamma i flag je false spremi rjesenje u polje i postavi flag na true
  for (var i=0; i<Ydata2.length; i++){
    if(Ydata2[i].toFixed(2) == gamma && flag == false){
      f2.push(i);
      flag = true;
    }
    //ukoliko nije jednako gamma postavi flag na false
    else if(Ydata2[i].toFixed(2) != gamma) {
      flag = false;
    }
  }

  //izracunaj bandwidth (f2-f1)
  var bw1 = f1[1] - f1[0];
  var bw2 = f2[1] - f2[0];

  //izracunaj fo (f1+f2 / 2)
  var fo1 = (f1[0] + f1[1]) / 2;
  //relativni bw
  var relBW1 = (bw1 / fo1 * 100).toFixed(2);
  var fo2 = (f2[0] + f2[1]) / 2;
  var relBW2 = (bw2 / fo2 * 100).toFixed(2);

  //ispisi rjesenja
  document.getElementById("bandwidth1rjesenje").innerHTML = "<font color='#47A3FF'>1. rješenje: f1 = " + f1[0] + " MHz; " +
        "f2 = " + f1[1] + " MHz<br> BW = " + bw1 + " MHz; BW<sub>rel</sub> = " + relBW1 + " %</font>";
  document.getElementById("bandwidth2rjesenje").innerHTML = "<font color='#FF4747'>2. rješenje: f1 = " + f2[0] + " MHz; " +
        "f2 = " + f2[1] + " MHz<br> BW = " + bw2 + " MHz; BW<sub>rel</sub> = "+ relBW2 + " %</font>";

  //iscrtavanje rijesenja na grafuNa
  //selektiraj graf
  var graph = d3.select("#graph").select("svg");

  //ukoliko postoje neka od rijesenja izbrisi ih
  if ((typeof(horizontalLine) !== 'undefined')){
    horizontalLine.remove()
  }

  if ((typeof(f11Line) !== 'undefined')){
    f11Line.remove()
  }

  if ((typeof(f12Line) !== 'undefined')){
    f12Line.remove()
  }

  if ((typeof(f21Line) !== 'undefined')){
    f21Line.remove()
  }

  if ((typeof(f22Line) !== 'undefined')){
    f22Line.remove()
  }

  //horizontalna linija za gamma vrijednost
  horizontalLine = graph.append("svg:line")
    .attr("x1", 0 + 80)
    .attr("y1", yScale(gamma) + 20)
    .attr("x2", 1500 + 25)
    .attr("y2", yScale(gamma) + 20)
    .style("stroke", "black")
    .style("stroke-width", 2);

  if(!isNaN(f1[0])){
    //f1 linija prvog rjesenja
    f11Line = graph.append("svg:line")
      .attr("x1", xScale(f1[0]) + 80)
      .attr("y1", yScale(0) + 20)
      .attr("x2", xScale(f1[0]) + 80)
      .attr("y2", yScale(gamma) + 20)
      .style("stroke", "#47A3FF")
      .style("stroke-width", 2)
      .style("stroke-dasharray", ("2, 2"));
  }

  if(!isNaN(f1[1])){
  //f2 linija prvog rjensenja
  f12Line = graph.append("svg:line")
    .attr("x1", xScale(f1[1]) + 80)
    .attr("y1", yScale(0) + 20)
    .attr("x2", xScale(f1[1]) + 80)
    .attr("y2", yScale(gamma) + 20)
    .style("stroke", "#47A3FF")
    .style("stroke-width", 2)
    .style("stroke-dasharray", ("2, 2"));
  }

  if(!isNaN(f2[0])){
  //f1 linija drugog rjesenja
  f21Line = graph.append("svg:line")
    .attr("x1", xScale(f2[0]) + 80)
    .attr("y1", yScale(0) + 20)
    .attr("x2", xScale(f2[0]) + 80)
    .attr("y2", yScale(gamma) + 20)
    .style("stroke", "#FF4747")
    .style("stroke-width", 2)
    .style("stroke-dasharray", ("2, 2"));
  }

  if(!isNaN(f2[1])){
  //f2 linija drugog rjesenja
  f22Line = graph.append("svg:line")
    .attr("x1", xScale(f2[1]) + 80)
    .attr("y1", yScale(0) + 20)
    .attr("x2", xScale(f2[1]) + 80)
    .attr("y2", yScale(gamma) + 20)
    .style("stroke", "#FF4747")
    .style("stroke-width", 2)
    .style("stroke-dasharray", ("2, 2"));
  }
  //bandwidth je ispisan
  isBandwidth = true;
}

//funkcija za spremanje datoteke
function save(){
  //uzmi vrijednosti za spremanje
  var z0 = document.getElementById("z0").value;
  var rl = document.getElementById("rl").value;
  var xl = document.getElementById("xl").value;
  var f = document.getElementById("f").value;

  //zapisi vrijednosti u varijablu (Windows formatiranje)
	var text = z0 + "\r\n" + rl + "\r\n" + xl + "\r\n" + f;

  //stvori blob i download link na buttonu
	var textFileAsBlob = new Blob([text], {type:'text/plain'});
	var fileNameToSaveAs = document.getElementById("FileNameToSave").value;

	var downloadLink = document.createElement("a");
	downloadLink.download = fileNameToSaveAs;
	downloadLink.innerHTML = "Download File";
	if (window.webkitURL != null){
		// Chrome allows the link to be clicked
		// without actually adding it to the DOM.
		downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
	}
	else{
		// Firefox requires the link to be added to the DOM
		// before it can be clicked.
		downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
		downloadLink.onclick = destroyClickedElement;
		downloadLink.style.display = "none";
		document.body.appendChild(downloadLink);
	}

	downloadLink.click();

}

//unisti kliknuti element ( potrebno kako bi radilo u Firefoxu)
function destroyClickedElement(event){
	document.body.removeChild(event.target);
}

//funkcija za ucitavanje datoteke
function load(){
  //file u koji ce se spremati
	var fileToLoad = document.getElementById("fileToLoad").files[0];

  //stvori novi FileReader
	var fileReader = new FileReader();
	fileReader.onload = function(fileLoadedEvent){
		var text = fileLoadedEvent.target.result;
    //razdvoji string u polje
    var text = text.split("\r\n");
    //spremi u određene textboxove i trigeraj onchange event za ispis zl
		document.getElementById("z0").value = text[0];
    document.getElementById("rl").value = text[1];
    document.getElementById("rl").onchange();
    document.getElementById("xl").value = text[2];
    document.getElementById("xl").onchange();
    document.getElementById("f").value = text[3];
	};
  //utf-8 formatiranje
	fileReader.readAsText(fileToLoad, "UTF-8");
}

//funkcija za prikaz opceg rjesenja
function toggle_visibility(id){
       var e = document.getElementById(id);
       if(e.style.display == 'block')
          e.style.display = 'none';
       else
          e.style.display = 'block';
}
