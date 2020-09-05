// Run this script. assuming there is:
	// an input tag with id of 'day'
	// an input tag with id of 'diapers'
	// an input tag with id of 'formula'
	// an input tag with id of 'milk'

var arraysToCheck = ['days', 'diapers', 'formula','milk']

// Using the toDateInputValue function, automatically input the date for the user.
Date.prototype.toDateInputValue = (function() {
    var local = new Date(this);
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    return local.toJSON().slice(0,10);
});
document.getElementById('day').value = new Date().toDateInputValue();

// Initialize the arrays for this database
function createEmptyArrays() {
	let newArray_serialized = JSON.stringify([])

	for (let i = 0; i < arraysToCheck.length; i++) {
		localStorage.setItem(arraysToCheck[i], newArray_serialized) // Set up empty items for 'days', 'diapers', and more.
	}
}

// Reusable function to append and item to the chosen list.
function addToArray(array_name, value, whichType = "number") {
	// Before updating, make sure an array has been initialized in storage.
	if (localStorage.getItem('days') === null) {
		console.log('No existing array, creating one now...')
		createEmptyArrays()
	}

	// Parse the array so the new data can be appended.
	let thisArray = localStorage.getItem(array_name)
	thisArray_deserialized = JSON.parse(thisArray)

	if (whichType === "number") {
		// Push into the array as a number
		thisArray_deserialized.push(parseInt(value))
	} if (whichType === "keepString") {
		// Push into the array as a string
		thisArray_deserialized.push(value)
	}

	thisArray_serialized = JSON.stringify(thisArray_deserialized)

	console.log(`Adding ${value} to array`)
	localStorage.setItem(array_name, thisArray_serialized)
}

// Sort the array based on a reference array.
// Shout out to Don McCurdy: https://stackoverflow.com/a/27309301
function refSort (targetData, refData) {
  // Create an array of indices [0, 1, 2, ...N].
  var indices = Object.keys(refData);

  // Sort array of indices according to the reference data.
  indices.sort(function(indexA, indexB) {
    if (refData[indexA] < refData[indexB]) {
      return -1;
    } else if (refData[indexA] > refData[indexB]) {
      return 1;
    }
    return 0;
  });

  // Map array of indices to corresponding values of the target array.
  return indices.map(function(index) {
    return targetData[index];
  });
}

function sortDatabase() {
	// When the dates are all out of order, sort through all *four* arrays at once to put them in chronological order.
	let daysArrayString = localStorage.getItem('days')
	let daysArray = JSON.parse(daysArrayString)

	// A string cannot be sorted, so convert dates to integers
	for (let i = 0; i < daysArray.length; i++) {
		daysArray[i] = dateToInt(daysArray[i]) // Pass in the date string *2020-8-10*, and spit out 20810 to sort it
	}

	for (let i = 0; i < arraysToCheck.length; i++) {
		// Set up empty items for 'days', 'diapers', and more.
		let thisArray = JSON.parse(localStorage.getItem(arraysToCheck[i]))
		let thisArray_sorted = refSort(thisArray, daysArray)

		// Redefine this data with the newly sorted array.
		localStorage.setItem(arraysToCheck[i], JSON.stringify(thisArray_sorted))
	}
}

// Process all of the data from the form
function updateStorage() {
	// Access the user data from the form
	const dayInpt = document.getElementById('day');
	const diaperInpt = document.getElementById('diapers');
	const formulaInpt = document.getElementById('formulaOunces');
	const milkInpt = document.getElementById('milkOunces');

	const dayVal = dayInpt.value;
	const diapersVal = diaperInpt.value;
	const formulaVal = formulaInpt.value;
	const milkVal = milkInpt.value;

	// Before adding to storage, make sure this date is not already taken
	if (localStorage.getItem('days')) {
		deserialized_DateToCheck = JSON.parse(localStorage.getItem('days'))
		if (deserialized_DateToCheck.includes(dayVal)) {
			window.alert('Please select a new date.')
			return
		}
	}

	if (dayVal) {
		addToArray('days', dayVal, 'keepString')
	}

	if (diapersVal) {
		addToArray('daipers', diapersVal)
	}

	if (formulaVal) {
		addToArray('formula', formulaVal)
	}

	if (milkVal) {
		addToArray('milk', milkVal)
	}

	// Automatically sort the data (by accessing the sortDatabase function in the displayData script that was referenced on the line above in the HTML file)
	sortDatabase()

	// window.alert('Added')
	window.location = 'index.html';
}

function clearMyDatabase() {
	localStorage.clear()

	window.alert('Storage is now empty.');
}

// Function to delete a day from the arrays
function deleteDate() {
	let dateArray = JSON.parse(localStorage.getItem('days'))
	let milkArray = JSON.parse(localStorage.getItem('milk'))
	let formulaArray = JSON.parse(localStorage.getItem('formula'))
	let diapersArray = JSON.parse(localStorage.getItem('daipers'))
	
	let dateToRemove = document.querySelector('#day').value

	if (dateArray.includes(dateToRemove)) {
		for (let i = 0; i < dateArray.length; i++) {
			if (dateArray[i] == dateToRemove) {
				dateArray.splice(i, 1)
				milkArray.splice(i, 1)
				formulaArray.splice(i, 1)
				diapersArray.splice(i, 1)

				localStorage.setItem('days', JSON.stringify(dateArray))
				localStorage.setItem('daipers', JSON.stringify(diapersArray))
				localStorage.setItem('formula', JSON.stringify(formulaArray))
				localStorage.setItem('milk', JSON.stringify(milkArray))

				window.alert("Succuessfully deleted this date!")
				return
			}
		}
	} 
	else {
		window.alert("Please choose a new date")
	}
}

