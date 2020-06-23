// Creating the grid

// Scroll to top on reload
window.onbeforeunload = function () {
	window.scrollTo(0, 0)
}

grid = {
	width: 19,
	height: 20,

	girdColorsClass: ['basicCross', 'redCross', 'yellowCross', 'noCross'],
	textColorsClass: ['red', 'yellow', 'green'],

	glitchCharacters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789&()!?/\\*$¥€£#<>+-%@§',

	$main: document.querySelector('.main'),
	$grid: document.querySelector('.grid'),
	$cellsArray: [],
	$cellsMatrix: [],
	$pMatrix: [],
	$babyOverlays: [],

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
				this.$cellsArray.push($cell)
				cellsArray.push($cell)
				pArray.push($p)
			}
			this.$grid.appendChild($row)
			this.$cellsMatrix.push(cellsArray)
			this.$pMatrix.push(pArray)
		}
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

	setupBabyOverlay({ x, y, width, height, className, content, mouseEnterCall, mouseLeaveCall, mouseClickCall }) {
		// Create element
		let div = document.createElement('div')
		div.classList.add('babyOverlay')
		if (className != undefined) {
			div.classList.add(className)
		}
		// Append content
		if (content != undefined) {
			div.append(content)
		}

		// Set position and size
		div.style.left = `calc(1px + 5.555vw * ${x})`
		div.style.top = `calc(1px + 5.555vw * ${y} + 1px * ${y})`
		div.style.width = `calc(5.555vw * ${width} - 1.5px)`
		div.style.height = `calc(5.555vw * ${height} + 1px * ${height - 1})`

		// Set mouse events
		if (mouseEnterCall != undefined) {
			div.addEventListener('mouseenter', () => {
				mouseEnterCall()
			})
		}
		if (mouseLeaveCall != undefined) {
			div.addEventListener('mouseleave', () => {
				mouseLeaveCall()
			})
		}
		if (mouseClickCall != undefined) {
			div.addEventListener('click', () => {
				mouseClickCall()
			})
		}

		// Append the element in the main & store it in an array
		this.$main.appendChild(div)
		this.$babyOverlays.push(div)
	},

	setupLoadingAnimation(x, y, delay) {
		let p = this.$pMatrix[y][x]
		let loadingCharacters = ['|', '/', '―', '\\']
		let index = 0
		p.innerHTML = loadingCharacters[index]
		loadingAnimationIteration = () => {
			if (p.innerHTML === loadingCharacters[index]) {
				index === loadingCharacters.length - 1 ? (index = 0) : index++
				p.innerHTML = loadingCharacters[index]
				setTimeout(() => {
					loadingAnimationIteration()
				}, delay)
			}
		}
		loadingAnimationIteration()
	},

	setupScrollCallAnimation(x, y, delay) {
		let cell = this.$cellsMatrix[y][x]
		let img = document.createElement('img')
		img.setAttribute('src', 'assets/triangleArrow.svg')
		cell.appendChild(img)
		let hidden = false
		setInterval(() => {
			if (hidden) {
				img.style.opacity = 1
				hidden = false
			} else {
				img.style.opacity = 0
				hidden = true
			}
		}, delay)
	},
}
grid.setup()

// NAVIGATION

let navigation = {
	input: '',
	possibleInput: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789&()!?/\\*$¥€£#<>+-%@§\'"`,:;.{}=',
	actualY: 0,
	isLoading: false,

	analyzedPassword: {},

	// Creating init interface

	init() {
		// Hide the grid
		for (let i = 0; i < grid.width; i++) {
			for (let j = 0; j < grid.height; j++) {
				grid.changeGridColor(i, j, 3)
			}
		}
		// Display password enter interface
		grid.displayWord({ x: 2, y: 4, word: 'ENTR', minLength: 3, maxLength: 10, delay: 200, gridColor: 0, color: 0 })
		grid.changeGridColor(2, 3, 0)
		grid.$cellsMatrix[3][2].classList.add('lightBackCell')

		// Create password input
		let refCoord = [2, 3]
		let coord = [2, 3]
		window.addEventListener('keydown', (_event) => {
			if (!this.isLoading) {
				if (_event.code === 'Backspace') {
					// Erase
					this.input = this.input.substr(0, this.input.length - 1)
					if (coord[0] != refCoord[0]) {
						grid.$cellsMatrix[coord[1]][coord[0]].classList.remove('lightBackCell')
						grid.changeGridColor(coord[0] + 1, coord[1], 3)
						coord[0]--
						grid.$cellsMatrix[coord[1]][coord[0]].classList.add('lightBackCell')
						for (let i = 0; i < 4; i++) {
							grid.changeGridColor(2 + i, 4, 0)
						}
					}
					grid.$pMatrix[coord[1]][coord[0]].innerHTML = ''
				} else if (this.possibleInput.indexOf(_event.key.toUpperCase()) != -1 && this.input.length < 8) {
					// Write
					this.input += _event.key
					grid.$pMatrix[coord[1]][coord[0]].innerHTML = '*'
					grid.$cellsMatrix[coord[1]][coord[0]].classList.remove('lightBackCell')
					coord[0]++
					if (this.input.length < 8) {
						grid.changeGridColor(coord[0], coord[1], 0)
						grid.$cellsMatrix[coord[1]][coord[0]].classList.add('lightBackCell')
					}
				}
			}
		})

		// Create "Enter the password" text
		let p = (document.createElement('p').innerHTML = 'Enter the password')
		grid.setupBabyOverlay({ x: 2, y: 2, width: 4, height: 1, className: 'textBabyOverlay', content: p })

		// Create mouse events function
		mouseEnterEntrButton = () => {
			grid.displayWord({ x: 2, y: 4, word: 'ENTR', minLength: 0, maxLength: 5, delay: 10, gridColor: 0, color: 0 })
			for (let i = 0; i < 4; i++) {
				grid.$cellsMatrix[4][i + 2].classList.add('lightBackCell')
			}
		}
		mouseLeaveEntrButton = () => {
			for (let i = 0; i < 4; i++) {
				grid.$cellsMatrix[4][i + 2].classList.remove('lightBackCell')
			}
		}
		mouseClickEntrButton = () => {
			if (this.input.length > 0) {
				this.displaySearch(this.input)
			}
		}

		// Setup the mouse events trigger div
		grid.setupBabyOverlay({ x: 2, y: 4, width: 4, height: 1, className: 'pointerBabyOverlay', mouseEnterCall: mouseEnterEntrButton, mouseLeaveCall: mouseLeaveEntrButton, mouseClickCall: mouseClickEntrButton })
	},

	// Display information after password search

	displaySearch() {
		this.isLoading = true

		// Kill baby overlays
		for (let i = grid.$babyOverlays.length - 1; i >= 0; i--) {
			grid.$main.removeChild(grid.$babyOverlays[i])
			grid.$babyOverlays.pop()
		}
		// Display input
		grid.displayWord({ x: 2, y: 3, word: this.input, minLength: 5, maxLength: 25, delay: 300 })

		// Display grid
		// A REFAIRE PTN AVEC DU STAGGER
		for (let i = 0; i < grid.width; i++) {
			for (let j = 0; j < grid.height; j++) {
				grid.changeGridColor(i, j, 0)
				grid.$cellsMatrix[j][i].classList.remove('lightBackCell')
			}
		}
		// Display title
		grid.displayWord({ x: 2, y: 1, word: 'SEARCH', minLength: 3, maxLength: 10, delay: 200, gridColor: 2 })

		// Display menu
		grid.createMenu(15, 1)

		// Display loader
		grid.displayWord({ x: 2, y: 6, word: 'LOADING', minLength: 3, maxLength: 10, delay: 200 })
		grid.setupLoadingAnimation(10, 6, 100)

		// Display SRCH
		grid.displayWord({ x: 2, y: 4, word: 'SRCH', minLength: 0, maxLength: 5, delay: 10, gridColor: 0, color: 0 })

		// Analyze password
		this.analyzePassword(this.input)
	},

	displaySearchInfos() {
		this.actualY = 6

		// Display loading done
		grid.displayWord({ x: 10, y: 6, word: 'DONE', minLength: 3, maxLength: 10, delay: 200, color: 2 })
		setTimeout(() => {
			grid.setupScrollCallAnimation(15, 6, 600)
		}, 1100)

		// Unlock scroll
		document.querySelector('body').style.overflowY = 'visible'

		this.actualY += 2

		// Display password strength
		let displayPasswordStrength = () => {
			gsap.to(document.querySelector('.passwordResponseBabyOverlay'), 0.2, { opacity: 1 })
			gsap.to(document.querySelector('.passwordResponseBabyOverlay .bar'), 1, { width: `${this.analyzedPassword.strength}%` })
			let number = { value: 0 }
			let $number = document.querySelector('.passwordResponseBabyOverlay .number')
			gsap.to(number, 1, {
				value: this.analyzedPassword.strength,
				onUpdate: () => {
					$number.innerHTML = `${number.value.toFixed(1)}%`
				},
			})
		}
		scrollDidsplayer.add(8, displayPasswordStrength)

		this.actualY += 3

		// Display number of errors
		let numberOfErrors = 0
		!this.analyzedPassword.lowerCases ? numberOfErrors++ : null
		!this.analyzedPassword.upperCases ? numberOfErrors++ : null
		!this.analyzedPassword.correctLength ? numberOfErrors++ : null
		!this.analyzedPassword.numbers ? numberOfErrors++ : null
		!this.analyzedPassword.specialCharacters ? numberOfErrors++ : null

		let displayNumberOfErrors = () => {
			grid.displayWord({ x: 2, y: this.actualY, word: numberOfErrors.toString(), minLength: 3, maxLength: 10, delay: 200 })
			grid.displayWord({ x: 4, y: this.actualY, word: 'ERRORS', minLength: 3, maxLength: 10, delay: 200, color: 0 })
			grid.displayWord({ x: 11, y: this.actualY, word: 'FOUND', minLength: 3, maxLength: 10, delay: 200 })
		}
		scrollDidsplayer.add(11, displayNumberOfErrors)
	},

	analyzePassword(input) {
		// Analyse password with regex
		let upperCases = input.match(/[A-Z]/g)
		let lowerCases = input.match(/[a-z]/g)
		let specialCharacters = input.match(/[&()!?/\\*$¥€£#<>+\-%@§\'"`,:;.{}=]/g)
		let numbers = input.match(/[0-9]/g)

		// Define analyzedPassword with analyze result
		input.length < 8 ? (this.analyzedPassword.correctLength = false) : (this.analyzedPassword.correctLength = true)
		upperCases === null ? (this.analyzedPassword.upperCases = false) : (this.analyzedPassword.upperCases = true)
		lowerCases === null ? (this.analyzedPassword.lowerCases = false) : (this.analyzedPassword.lowerCases = true)
		specialCharacters === null ? (this.analyzedPassword.specialCharacters = false) : (this.analyzedPassword.specialCharacters = true)
		numbers === null ? (this.analyzedPassword.numbers = false) : (this.analyzedPassword.numbers = true)

		// Calculate password strength
		this.analyzedPassword.strength = new PasswordMeter().getResult(input).percent

		// Compare to the database
		let xmlhttp = new XMLHttpRequest()
		xmlhttp.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				this.databaseResponse = JSON.parse(this.response)
				navigation.analyzedPassword.databaseResponse = this.databaseResponse
				console.log(navigation.analyzedPassword)

				// Display search infos
				navigation.displaySearchInfos()
			}
		}
		xmlhttp.open('GET', `partials/passwordSearch.php?search=${input}`, true)
		xmlhttp.send()
	},
}
navigation.init()

grid.setupBabyOverlay({ x: 2, y: 15, width: 4, height: 1, className: 'testBabyOverlay' })

let scrollDidsplayer = {
	targets: [],

	setup() {
		window.addEventListener('scroll', () => {
			// console.log(window.scrollY + window.innerHeight)

			for (const _target of this.targets) {
				// console.log(0.0555 * window.innerWidth, document.querySelector('.main .grid .row .cell').getBoundingClientRect().height)
				// console.log(_target[0] * 0.0555 * window.innerWidth - 0.0555 * window.innerWidth + _target[0] * 2)
				if (window.scrollY + window.innerHeight > _target[0] * 0.0555 * window.innerWidth - 0.0555 * window.innerWidth && !_target[2]) {
					_target[2] = true
					_target[1]()
				}
			}
		})
	},

	add(y, call) {
		this.targets.push([y, call, false])
	},

	reset() {
		this.targets = []
	},
}
scrollDidsplayer.setup()

// Dynamic password search
function showPasswords(index, search) {
	let xmlhttp = new XMLHttpRequest()
	xmlhttp.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			// Get response here
			console.log(this.response)
		}
	}
	xmlhttp.open('GET', `partials/dynamicPasswordSearch.php?index=${index}&search=${search}`, true)
	xmlhttp.send()
}
