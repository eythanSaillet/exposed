// Creating the grid

grid = {
	width: 18,
	height: 20,

	$grid: document.querySelector('.grid'),

	setup() {
		for (let i = 0; i < this.height; i++) {
			$row = document.createElement('div')
			$row.classList.add('row')
			for (let j = 0; j < this.width; j++) {
				$cell = document.createElement('div')
				$cell.classList.add('cell')

				$row.appendChild($cell)
			}
			this.$grid.appendChild($row)
		}
	},
}
grid.setup()

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
