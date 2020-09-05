// File description: function to access local data and 'print' it to the HTML div element + function to sort the data
var arraysToCheck = ['days', 'daipers', 'formula','milk']

function dateToInt(dateString) {
	let thisDate = dateString
	let finalDate = ""

	// Pull the year from this string (Only good until 9999)
	for (let i = 0; i < 4; i++) {
		finalDate += thisDate[i]
	}


	// Pull the rest of the data from the string
	for (let i = 0; i < thisDate.length; i++) {
		if (i > 0 && (thisDate[i-1] === "-" || thisDate[i-2] === "-")) {
			finalDate += thisDate[i]
		}
	}

	return parseInt(finalDate)
}