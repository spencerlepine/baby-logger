// Assuming we have input tags with the id's of 'milkOunces', 'formulaOunces', and 'diapers'
function accessStorage() {
	var arraysToCheck = ['days', 'daipers', 'formula','milk']

	// Convert arraysToCheck to the parsed localStorage data.
	for (let i = 0; i < arraysToCheck.length; i++) {
		// Parse the array so the new data can be appended.
		let thisArray = localStorage.getItem(arraysToCheck[i])
		thisArray_deserialized = JSON.parse(thisArray)

		arraysToCheck[i] = thisArray_deserialized
	}

	return arraysToCheck
}

function elemChangeList() {
	return [document.querySelector('#day'),document.querySelector('#diapers'),document.querySelector('#formulaOunces'),document.querySelector('#milkOunces')]
}

function updateForm(lsArray, index) {
	let elementsToChangeArray = elemChangeList()
	document.querySelector('#formulaOutput').value = lsArray[2][index] // Assuming forumla is index 2

	for (let i = 1; i < elementsToChangeArray.length; i++) {
		if (elementsToChangeArray[i] == null) {
			return
		}


		elementsToChangeArray[i].value = lsArray[i][index]
	}
}

function findMyIndex(data) {
	var selectedDate = document.querySelector('#day').value // Pull the value from the date input within this (elem) form

	for (let i = 0; i < data[0].length; i++) {
		if (data[0][i] === selectedDate) {
			return i // Found the position of this day
		}
	}

	alert('Please select another date')

	// Invalid date is chosen, but form is already display: reset the value to show no date is selected.
	let elementsToChangeArray = elemChangeList()
	elementsToChangeArray.push(document.querySelector('#formulaOutput'))
	for (let a = 0; a < elementsToChangeArray.length; a++) {
		elementsToChangeArray[a].value = 0
	}

	return null
}

function sendToForm(elem) {
	let allData = accessStorage()
	indexToCheck = findMyIndex(allData)

	if (indexToCheck !== null) { // Use this data to display that date to the user
		updateForm(allData, indexToCheck)

		formAnimation()
	}
}

function formAnimation() {
	let formElement = document.querySelector(".hiddenForm")

	formElement.classList.remove("hiddemForm")
	formElement.classList.add("smoothFormAppear")
}

function updateStorage() {
	let allData = accessStorage()
	let littleIndex = findMyIndex(allData)

	let elementsToChangeArray = elemChangeList()
	for (let a = 0; a < allData.length; a++) {
		allData[a][littleIndex] = elementsToChangeArray[a].value
	}

	// Now that we have an updated/changed database, overwrite localStorage now.
	var arraysToCheck = ['days', 'daipers', 'formula','milk']
	for (let i = 0; i < arraysToCheck.length; i++) {
		stringify_thisArray = JSON.stringify(allData[i])
	
		localStorage.setItem(arraysToCheck[i], stringify_thisArray)
	}

	window.alert('Successfully update your log!')
	// Return to the homepage to display new data.
	window.location = 'index.html';
}