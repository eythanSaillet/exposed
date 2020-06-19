// Dynamic password search

function showPasswords(index, search) {
	var xmlhttp = new XMLHttpRequest()
	xmlhttp.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			// Get response here
			console.log(this.response)
		}
	}
	xmlhttp.open('GET', `partials/scrollDisplay.php?index=${index}&search=${search}`, true)
	xmlhttp.send()
}
