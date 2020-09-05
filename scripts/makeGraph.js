google.charts.load('current', {'packages':['corechart']});

// Get days array, parse it into array form, then convert it to readable dates.
dayArray = readableDate(JSON.parse(localStorage.getItem('days')))

function readableDate(unreadableList) {
  let dateFormattedList = []

  for (let i = 0; i < unreadableList.length; i++) {
    let tempDate = ""
    let unreadableDate = unreadableList[i]

    let howManyChars = unreadableDate.length - 5

    // If the data is 2020-10/22, we want to write 10/20, not 0/22
    if (unreadableDate[5] !== '0') {
      howManyChars = unreadableDate.length - 6
    }
    
    for (let a = unreadableDate.length - 1; a > howManyChars; a--) {
      if (unreadableDate[a] === "-") {
        tempDate = '/' + tempDate
      }
      else { tempDate = unreadableDate[a] + tempDate }
    }

    dateFormattedList.push(tempDate)
  }

  return dateFormattedList
}

function dataUnit(whichList) {
  if (whichList === 'diapers') {
    return 'Daipers'
  }
  else {
    return 'Ounces'
  }
}

function getData(whichList) { // passes through 'days', 'diapers', 'milk', or 'formula'
  let array = []
  let arrayUnit = dataUnit(whichList)
  array.push(['Day', arrayUnit])

  console.log(whichList)
  // Temporary code to filter *in* typo, to not break user database
  if (whichList.toLowerCase() === 'diapers') {
    whichList = 'daipers'
  }

  // // if (whichList.toLowerCase() === 'diapers') {
  //   whichList = 'daipers'
  // }

  thisArray = JSON.parse(localStorage.getItem(whichList))

  for (let i = 0; i < dayArray.length; i++) {
    array.push([dayArray[i], parseInt(thisArray[i])])
  }

  return array
}

// Returns the data for chart display in an array.
function getListNameFromDivText(elemName) {
  let whichChart = document.querySelector(elemName).innerText
  let array = getData(whichChart)
  data = google.visualization.arrayToDataTable(array);

  return whichChart
}

// Draw the first chart now:
function drawdiaperChart() {
  // var data = google.visualization.arrayToDataTable([
  //   ['Year', 'Sales', 'Expenses'],
  //   ['2013',  1000,      400],
  //   ['2014',  1170,      460],
  //   ['2015',  660,       1120],
  //   ['2016',  1030,      540]
  // ]);

  let name = getListNameFromDivText('#diaper_chart_div')
  name = name.charAt(0).toUpperCase() + name.slice(1);


  var options = {
    title: `Daily ${name} Use:`,
    hAxis: {title: 'Day',  titleTextStyle: {color: '#333'}},
    vAxis: {minValue: 0, maxValue: 50}
  };

  var chart = new google.visualization.AreaChart(document.getElementById('diaper_chart_div'));
  // Access global data variable set in getListNameFromDivText function.
  chart.draw(data, options);
}

function drawMilkChart() {
  let name = getListNameFromDivText('#milk_chart_div')
  name = name.charAt(0).toUpperCase() + name.slice(1);

  var options = {
    title: `Daily ${name} Use:`,
    hAxis: {title: 'Day',  titleTextStyle: {color: '#333'}},
    vAxis: {minValue: 0, maxValue: 50}
  };

  var chart = new google.visualization.AreaChart(document.getElementById('milk_chart_div'));
  chart.draw(data, options);
}

function drawFormulaChart() {
  let name = getListNameFromDivText('#formula_chart_div')
  name = name.charAt(0).toUpperCase() + name.slice(1);

  var options = {
    title: `Daily ${name} Use:`,
    hAxis: {title: 'Day',  titleTextStyle: {color: '#333'}},
    vAxis: {minValue: 0, maxValue: 50}
  };

  var chart = new google.visualization.AreaChart(document.getElementById('formula_chart_div'));
  chart.draw(data, options);
}

function getDataAll() {
  var arraysToCheck = ['daipers', 'formula','milk']

  let array = []
  array.push(['Day', 'Diapers', 'Formula', 'Milk'])

  let threeArrays = []
  for (let a = 0; a < arraysToCheck.length; a++) {
    threeArrays.push(JSON.parse(localStorage.getItem(arraysToCheck[a])))
  }

  for (let i = 0; i < dayArray.length; i++) {
    let evenSmallerArray = [dayArray[i]]
    for (let a = 0; a < arraysToCheck.length; a++) {
      evenSmallerArray.push(parseInt(threeArrays[a][i]))
    }
    
    array.push(evenSmallerArray)
  }

  return array
}

// Draw the comparison chart by defualt
google.charts.setOnLoadCallback(drawComparisonChart);

function drawComparisonChart() {
  
  name = 'Everything'

  var theData = getDataAll();
  var thisData = google.visualization.arrayToDataTable(theData);

  var options = {
    title: `Daily ${name} Use:`,
    hAxis: {title: 'Day',  titleTextStyle: {color: '#333'}},
    vAxis: {minValue: 0, maxValue: 50}
  };

  var chart = new google.visualization.AreaChart(document.getElementById('comparison_chart_div'));
  chart.draw(thisData, options);
}

var comparisonChartElement = document.getElementById('comparison_chart_div');
var diaperChartElement = document.getElementById('diaper_chart_div');
var milkChartElement = document.getElementById('milk_chart_div');
var formulaChartElement = document.getElementById('formula_chart_div');

function initializeCharts() {
  comparisonChartElement.style.display = 'block';

  diaperChartElement.style.display = 'none';
  milkChartElement.style.display = 'none';
  formulaChartElement.style.display = 'none';
}
initializeCharts()

function getDropDown(index) {
  if (index === "0") {
    console.log('Showing comparison chart')
    google.charts.setOnLoadCallback(drawComparisonChart);
    comparisonChartElement.style.display = 'block';

    diaperChartElement.style.display = 'none';
    milkChartElement.style.display = 'none';
    formulaChartElement.style.display = 'none';
  }
  else if (index === "1") {
     

     comparisonChartElement.style.display = 'none';

     diaperChartElement.style.display = 'block';
     milkChartElement.style.display = 'none';
     formulaChartElement.style.display = 'none';

     google.charts.setOnLoadCallback(drawdiaperChart);
  }
  else if (index === "2") {
     google.charts.setOnLoadCallback(drawMilkChart);

     comparisonChartElement.style.display = 'none';

     diaperChartElement.style.display = 'none';
     milkChartElement.style.display = 'block';
     formulaChartElement.style.display = 'none';
  }
  else if (index === "3") {
     google.charts.setOnLoadCallback(drawFormulaChart);

     comparisonChartElement.style.display = 'none';

     diaperChartElement.style.display = 'none';
     milkChartElement.style.display = 'none';
     formulaChartElement.style.display = 'block';
  }
}