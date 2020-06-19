// Creating the grid

grid = {
	width: 19,
	height: 20,

	colorsClass: ['basicCross', 'redCross', 'yellowCross'],

	$grid: document.querySelector('.grid'),
	$cellsMatrix: [],

	setup() {
		for (let i = 0; i < this.height; i++) {
			$row = document.createElement('div')
			$row.classList.add('row')
			let array = []
			for (let j = 0; j < this.width; j++) {
				$cell = document.createElement('div')
				$cell.classList.add('cell', 'basicCross')

				$p = document.createElement('p')
				$p.classList.add('letter')

				$cell.appendChild($p)
				$row.appendChild($cell)
				array.push($cell)
			}
			this.$grid.appendChild($row)
			this.$cellsMatrix.push(array)
		}
	},

	displayLetter(x, y, letter) {
		cell = this.$cellsMatrix[y][x]
		cell.querySelector('p').innerHTML = letter
	},

	changeColor(x, y, color) {
		let cellA = this.$cellsMatrix[y][x]
		let cellB,
			cellC,
			cellD = undefined
		if (x < this.width - 1) {
			cellB = this.$cellsMatrix[y][x + 1]
			if (y < this.height - 1) {
				cellC = this.$cellsMatrix[y + 1][x]
				cellD = this.$cellsMatrix[y + 1][x + 1]
			}
		}
		for (let i = 0; i < this.colorsClass.length; i++) {
			if (i === color) {
				cellA.classList.add(this.colorsClass[i])
				if (cellB) {
					cellB.classList.add(this.colorsClass[i])
				}
				if (cellC && cellD) {
					cellC.classList.add(this.colorsClass[i])
					cellD.classList.add(this.colorsClass[i])
				}
			} else {
				cellA.classList.remove(this.colorsClass[i])
				if (cellB) {
					cellB.classList.remove(this.colorsClass[i])
				}
				if (cellC && cellD) {
					cellC.classList.remove(this.colorsClass[i])
					cellD.classList.remove(this.colorsClass[i])
				}
			}
		}
	},
}
grid.setup()

grid.displayLetter(0, 0, 'A')
grid.displayLetter(2, 3, 'B')
grid.displayLetter(5, 7, '%')

grid.changeColor(0, 0, 1)
grid.changeColor(5, 5, 2)
grid.changeColor(18, 19, 1)

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
