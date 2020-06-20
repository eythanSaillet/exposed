// Creating the grid

grid = {
	width: 19,
	height: 20,

	colorsClass: ['basicCross', 'redCross', 'yellowCross', 'noCross'],
	glitchCharacters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ&()!?/*$¥€£##<>',

	$main: document.querySelector('.main'),
	$grid: document.querySelector('.grid'),
	$cellsMatrix: [],

	setup() {
		// Setup DOM grid
		for (let i = 0; i < this.height; i++) {
			let $row = document.createElement('div')
			$row.classList.add('row')
			let array = []
			for (let j = 0; j < this.width; j++) {
				let $cell = document.createElement('div')
				$cell.classList.add('cell', 'basicCross')

				let $p = document.createElement('p')
				$p.classList.add('letter')

				$cell.appendChild($p)
				$row.appendChild($cell)
				array.push($cell)
			}
			this.$grid.appendChild($row)
			this.$cellsMatrix.push(array)
		}

		this.createMenu(15, 1)
	},

	createMenu(x, y) {
		let cell = this.$cellsMatrix[y][x]
		this.changeColor(x, y, 1)
		cell.style.cursor = 'pointer'
		// Insert the svg
		let img = document.createElement('img')
		img.classList.add('menuButton')
		img.setAttribute('src', 'assets/menuButton.svg')
		cell.appendChild(img)
	},

	displayWord({ x, y, word, minLength, maxLength, delay = 50 }) {
		let indexes = []
		for (let i = 0; i < word.length; i++) {
			let random = Math.floor(Math.random() * word.length)
			while (indexes.indexOf(random) != -1) {
				random = Math.floor(Math.random() * word.length)
			}
			indexes.push(random)
		}

		let index = 0
		let intervalID = setInterval(() => {
			if (index < indexes.length) {
				this.displayLetterWithGlitch({ x: x + indexes[index], y: y, letter: word[indexes[index]], minLength: minLength, maxLength: maxLength })
				// TEMPO
				this.changeColor(x + indexes[index], y, 2)
				// TEMPO
				index++
			} else {
				clearInterval(intervalID)
			}
		}, delay)
	},

	displayLetter(x, y, letter) {
		let cell = this.$cellsMatrix[y][x]
		cell.querySelector('p').innerHTML = letter
	},

	displayLetterWithGlitch({ x, y, letter, minLength, maxLength, delay = 50 }) {
		let cell = this.$cellsMatrix[y][x]
		let randomLength = Math.round(Math.random() * (maxLength - minLength) + minLength)
		let glitchStates = []
		for (let i = 0; i < randomLength; i++) {
			let randomCharacter = this.glitchCharacters[Math.floor(Math.random() * this.glitchCharacters.length)]
			glitchStates.push(randomCharacter)
		}
		glitchStates.push(letter)

		let index = 0
		function glictchIteration() {
			if (index < glitchStates.length) {
				cell.querySelector('p').innerHTML = glitchStates[index]
				setTimeout(() => {
					index++
					glictchIteration()
				}, delay)
			}
		}
		glictchIteration()
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

	setupBabyOverlay({ x, y, width, height, color, className }) {
		// Create element
		let div = document.createElement('div')
		div.classList.add('babyOverlay')
		if (className) {
			div.classList.add(className)
		}

		// Set position and size
		div.style.background = color
		div.style.left = `calc(1px + 5.555vw * ${x})`
		div.style.top = `calc(1px + 5.555vw * ${y} + 1px * ${y})`
		div.style.width = `calc(5.555vw * ${width} - 1.5px)`
		div.style.height = `calc(5.555vw * ${height} + 1px * ${height - 1})`

		// Append the element in the main
		this.$main.appendChild(div)
	},
}
grid.setup()

grid.setupBabyOverlay({ x: 2, y: 3, width: 2, height: 2, color: 'var(--backgroundColor)' })

// grid.displayLetterWithGlitch({ x: 1, y: 1, letter: 'J', minLength: 5, maxLength: 10 })

// grid.displayLetter(0, 0, 'A')
// grid.displayLetter(2, 3, 'B')
// grid.displayLetter(5, 7, '%')

grid.displayWord({ x: 2, y: 1, word: 'EXPOSED', minLength: 5, maxLength: 30, delay: 100 })

// grid.changeColor(0, 0, 1)
// grid.changeColor(5, 5, 2)
// grid.changeColor(18, 19, 1)

// Dynamic password search

let navigation = {
	init() {},
}

function showPasswords(index, search) {
	let xmlhttp = new XMLHttpRequest()
	xmlhttp.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			// Get response here
			console.log(this.response)
		}
	}
	xmlhttp.open('GET', `partials/scrollDisplay.php?index=${index}&search=${search}`, true)
	xmlhttp.send()
}
