// Creating the grid

grid = {
	width: 19,
	height: 20,

	girdColorsClass: ['basicCross', 'redCross', 'yellowCross', 'noCross'],
	textColorsClass: ['red', 'yellow'],

	glitchCharacters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ&()!?/*$¥€£#<>+-%@\\',

	$main: document.querySelector('.main'),
	$grid: document.querySelector('.grid'),
	$cellsMatrix: [],
	$pMatrix: [],

	setup() {
		// Setup DOM grid
		for (let i = 0; i < this.height; i++) {
			let $row = document.createElement('div')
			$row.classList.add('row')
			let cellsArray = []
			let pArray = []
			for (let j = 0; j < this.width; j++) {
				let $cell = document.createElement('div')
				$cell.classList.add('cell', 'basicCross')

				let $p = document.createElement('p')
				$p.classList.add('letter')

				$cell.appendChild($p)
				$row.appendChild($cell)
				cellsArray.push($cell)
				pArray.push($p)
			}
			this.$grid.appendChild($row)
			this.$cellsMatrix.push(cellsArray)
			this.$pMatrix.push(pArray)
		}
		// this.createMenu(15, 1)
	},

	createMenu(x, y) {
		let cell = this.$cellsMatrix[y][x]
		this.changeGridColor(x, y, 1)
		cell.style.cursor = 'pointer'
		// Insert the svg
		let img = document.createElement('img')
		img.classList.add('menuButton')
		img.setAttribute('src', 'assets/menuButton.svg')
		cell.appendChild(img)
	},

	displayWord({ x, y, word, minLength, maxLength, delay = 50, gridColor, color }) {
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
				this.displayLetterWithGlitch({ x: x + indexes[index], y: y, letter: word[indexes[index]], color: color, minLength: minLength, maxLength: maxLength })
				if (gridColor != undefined) {
					this.changeGridColor(x + indexes[index], y, gridColor)
				}
				index++
			} else {
				clearInterval(intervalID)
			}
		}, delay)
	},

	displayLetterWithGlitch({ x, y, letter, color, minLength, maxLength, delay = 60 }) {
		let randomLength = Math.round(Math.random() * (maxLength - minLength) + minLength)
		let glitchStates = []
		for (let i = 0; i < randomLength; i++) {
			let randomCharacter = this.glitchCharacters[Math.floor(Math.random() * this.glitchCharacters.length)]
			glitchStates.push(randomCharacter)
		}
		glitchStates.push(letter)
		if (color != undefined) {
			grid.$pMatrix[y][x].classList.add(grid.textColorsClass[color])
		}
		let index = 0
		function glitchIteration(color) {
			if (index < glitchStates.length) {
				grid.$pMatrix[y][x].innerHTML = glitchStates[index]
				setTimeout(() => {
					index++
					glitchIteration(color)
				}, delay)
			}
		}
		glitchIteration(color)
	},

	changeGridColor(x, y, color) {
		let cellA = this.$cellsMatrix[y][x]
		let cellB,
			cellC,
			cellD = undefined
		if (color === 3) {
			cellA.classList.add('noHoverReaction')
		} else {
			cellA.classList.remove('noHoverReaction')
		}
		if (x < this.width - 1) {
			cellB = this.$cellsMatrix[y][x + 1]
			if (y < this.height - 1) {
				cellC = this.$cellsMatrix[y + 1][x]
				cellD = this.$cellsMatrix[y + 1][x + 1]
			}
		}
		for (let i = 0; i < this.girdColorsClass.length; i++) {
			if (i === color) {
				cellA.classList.add(this.girdColorsClass[i])
				if (cellB) {
					cellB.classList.add(this.girdColorsClass[i])
				}
				if (cellC && cellD) {
					cellC.classList.add(this.girdColorsClass[i])
					cellD.classList.add(this.girdColorsClass[i])
				}
			} else {
				cellA.classList.remove(this.girdColorsClass[i])
				if (cellB) {
					cellB.classList.remove(this.girdColorsClass[i])
				}
				if (cellC && cellD) {
					cellC.classList.remove(this.girdColorsClass[i])
					cellD.classList.remove(this.girdColorsClass[i])
				}
			}
		}
	},

	setupBabyOverlay({ x, y, width, height, className, mouseEnterCall }) {
		// Create element
		let div = document.createElement('div')
		div.classList.add('babyOverlay')
		if (className != undefined) {
			div.classList.add(className)
		}

		// Set position and size
		div.style.left = `calc(1px + 5.555vw * ${x})`
		div.style.top = `calc(1px + 5.555vw * ${y} + 1px * ${y})`
		div.style.width = `calc(5.555vw * ${width} - 1.5px)`
		div.style.height = `calc(5.555vw * ${height} + 1px * ${height - 1})`

		// Set the event on hover
		if (mouseEnterCall != undefined) {
			div.addEventListener('mouseon', () => {
				mouseEnterCall()
			})
		}

		// Append the element in the main
		this.$main.appendChild(div)
	},
}
grid.setup()

// grid.setupBabyOverlay({ x: 2, y: 3, width: 2, height: 2, className: 'basicBabyOverlay' })

// grid.displayLetterWithGlitch({ x: 1, y: 1, letter: 'J', minLength: 5, maxLength: 10 })

// grid.displayLetter(0, 0, 'A')
// grid.displayLetter(2, 3, 'B')
// grid.displayLetter(5, 7, '%')

// grid.displayWord({ x: 2, y: 1, word: 'EXPOSED', minLength: 5, maxLength: 30, delay: 100 })

// grid.changeGridColor(5, 5, 2)
// grid.changeGridColor(18, 19, 1)

let navigation = {
	input: '',

	init() {
		// Clear the grid colors
		for (let i = 0; i < grid.width; i++) {
			for (let j = 0; j < grid.height; j++) {
				grid.changeGridColor(i, j, 3)
			}
		}
		// Display password enter interface
		grid.displayWord({ x: 3, y: 4, word: 'ENTR', minLength: 5, maxLength: 15, delay: 250, gridColor: 0, color: 0 })
		grid.changeGridColor(3, 3, 0, true)
		grid.$cellsMatrix[3][3].classList.add('lightBackCell')

		// Create password input
		let refCoord = [3, 3]
		let coord = [3, 3]
		let possibleInput = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ&()!?/\\*$¥€£#<>+-%@'
		window.addEventListener('keydown', (_event) => {
			console.log(possibleInput.indexOf(_event.code.toUpperCase()))
			console.log(_event.code)
			if (_event.code === 'Backspace') {
				this.input = this.input.substr(0, this.input.length - 1)
				console.log(this.input)
				if (coord[0] != refCoord[0]) {
					grid.$cellsMatrix[coord[1]][coord[0]].classList.remove('lightBackCell')
					grid.changeGridColor(coord[0] + 1, coord[1], 3)
					coord[0]--
					grid.$cellsMatrix[coord[1]][coord[0]].classList.add('lightBackCell')
					for (let i = 0; i < 4; i++) {
						grid.changeGridColor(3 + i, 4, 0)
					}
				}
				grid.$pMatrix[coord[1]][coord[0]].innerHTML = ''
			} else if (possibleInput.indexOf(_event.key.toUpperCase()) != -1 && this.input.length < 8) {
				this.input += _event.key.toUpperCase()
				grid.$pMatrix[coord[1]][coord[0]].innerHTML = '*'
				grid.$cellsMatrix[coord[1]][coord[0]].classList.remove('lightBackCell')
				coord[0]++
				console.log(this.input)
				if (this.input.length < 8) {
					grid.changeGridColor(coord[0], coord[1], 0)
					grid.$cellsMatrix[coord[1]][coord[0]].classList.add('lightBackCell')
				}
			}
		})
	},
}
navigation.init()

// function log() {
// 	console.log('hey')
// }

// grid.setupBabyOverlay({ x: 2, y: 7, width: 4, height: 1, className: 'testBabyOverlay', log })

// Dynamic password search
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
