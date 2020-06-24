// Creating the grid

// Scroll to top on reload
window.onbeforeunload = function () {
	window.scrollTo(0, 0)
}

grid = {
	width: 19,
	height: 100,

	girdColorsClass: ['basicCross', 'redCross', 'yellowCross', 'noCross'],
	textColorsClass: ['red', 'yellow', 'green', 'pink'],

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
		div.style.left = `calc(1px + 5.555vw * ${x} + 1px * ${x})`
		div.style.top = `calc(1px + 5.555vw * ${y} + 1px * ${y})`
		div.style.width = `calc(5.555vw * ${width} + 1px * ${x} * 2)`
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
	possibleInput: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789&()!?/\\*$¥€£#<>+-%@§'`,:;.{}=ÙÉÈÀ",
	actualY: 0,
	isLoading: false,
	searchErrorsData: {
		lowerCases: ['NO LOWERCASE', 'Varying between upper and lower case increases the strength of your password significantly.'],
		upperCases: ['NO UPPERCASE', 'Varying between upper and lower case increases the strength of your password significantly.'],
		length: ['PASSWORD TOO SHORT', 'Your password is too short. Try making it longer by adding some characters !'],
		numbers: ['NO NUMBERS', "Your password doesn't contain any number ... Maybe try and add some !"],
		specialCharacters: ['NO SPECIAL CHARACTER', 'By using special characters, you increase the strength of your password !'],
	},
	passwordStrengthsSentences: [
		"Your password is not safe enough ! You should change it as soon as possible. Let's see what you could change to improve it.",
		'Careful ! Your password could be a lot safer if you added some more characters ... Check out the advices we have for you !',
		'Nice one, but it could be a little safer. Check out the advices we have for you !',
		'Beautiful ! Your data should be safe with this password. Carry on keeping your data safe :3',
	],

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
		let p = (document.createElement('p').innerHTML = 'Type the password')
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
		grid.displayWord({ x: 2, y: 3, word: this.input, minLength: 3, maxLength: 10, delay: 200 })

		// Clear cells backgrounds
		for (let i = 0; i < grid.width; i++) {
			for (let j = 0; j < grid.height; j++) {
				grid.$cellsMatrix[j][i].classList.remove('lightBackCell')
			}
		}
		// Display the grid
		gsap.to(grid.$cellsArray, {
			stagger: {
				grid: 'auto',
				from: 'random',
				each: 0.05,

				onComplete: function () {
					if (this.targets()[0].classList.contains('noCross')) {
						this.targets()[0].classList.remove('noCross')
						this.targets()[0].classList.add('basicCross')
					}
				},
			},
		})
		// Display title
		grid.displayWord({ x: 2, y: 1, word: 'EXPOSED', minLength: 3, maxLength: 10, delay: 200, gridColor: 2 })

		// Display menu
		// grid.createMenu(15, 1)

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

		this.actualY += 3

		// Display password strength
		let label = document.createElement('p')
		label.innerHTML = 'PASSWORD TOO EASY'
		grid.setupBabyOverlay({ x: 2, y: this.actualY - 1, width: 6, height: 1, className: 'redLabelBabyOverlay', content: label })
		let sentenceIndex
		this.analyzedPassword.strength > 25 ? (this.analyzedPassword.strength > 50 ? (this.analyzedPassword.strength > 75 ? (sentenceIndex = 3) : (sentenceIndex = 2)) : (sentenceIndex = 1)) : (sentenceIndex = 0)
		document.querySelector('.passwordResponseBabyOverlay .text').innerHTML = this.passwordStrengthsSentences[sentenceIndex]
		let displayPasswordStrength = () => {
			gsap.to(label, 0.4, { opacity: 1 })
			gsap.to(document.querySelector('.passwordResponseBabyOverlay'), 0.4, { opacity: 1 })
			gsap.to(document.querySelector('.passwordResponseBabyOverlay .bar'), 1, { width: `${this.analyzedPassword.strength}%` })
			let number = { value: 0 }
			let $number = document.querySelector('.passwordResponseBabyOverlay .number')
			gsap.to(number, 1, {
				value: this.analyzedPassword.strength,
				onUpdate: () => {
					$number.innerHTML = `${Math.round(number.value)}%`
				},
			})
		}
		scrollDidsplayer.add(8, displayPasswordStrength)

		this.actualY += 4

		// Display number of errors
		let numberOfErrors = 0
		let errors = []
		if (!this.analyzedPassword.length) {
			numberOfErrors++
			errors.push('length')
		}
		if (!this.analyzedPassword.lowerCases) {
			numberOfErrors++
			errors.push('lowerCases')
		}
		if (!this.analyzedPassword.upperCases) {
			numberOfErrors++
			errors.push('upperCases')
		}
		if (!this.analyzedPassword.numbers) {
			numberOfErrors++
			errors.push('numbers')
		}
		if (!this.analyzedPassword.specialCharacters) {
			numberOfErrors++
			errors.push('specialCharacters')
		}

		let y1 = this.actualY
		let displayNumberOfErrors = () => {
			grid.displayWord({ x: 2, y: y1, word: numberOfErrors.toString(), minLength: 3, maxLength: 10, delay: 200 })
			grid.displayWord({ x: 4, y: y1, word: 'ERRORS', minLength: 3, maxLength: 10, delay: 200, color: 0 })
			grid.displayWord({ x: 11, y: y1, word: 'FOUND', minLength: 3, maxLength: 10, delay: 200 })
		}
		scrollDidsplayer.add(11, displayNumberOfErrors)

		this.actualY += 2

		let $errorComponent = document.querySelector('.errorsDisplayBabyOverlay')
		for (const _error of errors) {
			// Create label
			let $label = document.createElement('p')
			$label.innerHTML = this.searchErrorsData[_error][0]
			grid.setupBabyOverlay({ x: 2, y: this.actualY, width: 6, height: 1, className: 'redLabelBabyOverlay', content: $label })

			// Clone Component
			let $errorDiv = $errorComponent.cloneNode(true)

			// Set position
			$errorDiv.style.left = `calc(1px + 5.555vw * ${2})`
			$errorDiv.style.top = `calc(1px + 5.555vw * ${this.actualY + 1} + 1px * ${this.actualY + 1})`

			// Set properties
			$errorDiv.querySelector('.oldPassword').innerHTML = this.analyzedPassword.password
			$errorDiv.querySelector('.newPassword').innerHTML = this.analyzedPassword.correction[_error].password
			$errorDiv.querySelector('.text').innerHTML = this.searchErrorsData[_error][1]

			// Display and append
			$errorDiv.style.display = 'flex'
			grid.$main.append($errorDiv)
			this.actualY += 4

			// Setup scroll displayer
			let displayErrorDiv = () => {
				// Display overlay
				gsap.to($errorDiv, 0.4, { opacity: 1 })
				gsap.to($label, 0.4, { opacity: 1 })

				// Display strength bars
				gsap.to($errorDiv.querySelector('.oldStrength .bar'), 1, { scaleX: this.analyzedPassword.strength / 100 })
				gsap.to($errorDiv.querySelector('.newStrength .bar'), 1, { scaleX: this.analyzedPassword.correction[_error].strength / 100 })

				// Display strength values
				let strengths = { old: 0, new: 0 }
				let $numbers = {
					old: $errorDiv.querySelector('.oldStrength .number'),
					new: $errorDiv.querySelector('.newStrength .number'),
				}
				gsap.to(strengths, 1, {
					old: this.analyzedPassword.strength,
					onUpdate: () => {
						$numbers.old.innerHTML = `${Math.round(strengths.old)}%`
					},
				})
				gsap.to(strengths, 1, {
					new: this.analyzedPassword.correction[_error].strength,
					onUpdate: () => {
						$numbers.new.innerHTML = `${Math.round(strengths.new)}%`
					},
				})
			}
			scrollDidsplayer.add(this.actualY, displayErrorDiv)
		}

		this.actualY += 1

		// Display brute force title

		let y2 = this.actualY
		let displayBruteForceTitle = () => {
			console.log(y2)
			grid.displayWord({ x: 3, y: y2, word: 'BRUTE', minLength: 3, maxLength: 10, delay: 200, color: 3 })
			grid.displayWord({ x: 10, y: y2, word: 'FORCE', minLength: 3, maxLength: 10, delay: 200 })
		}
		scrollDidsplayer.add(this.actualY, displayBruteForceTitle)

		this.actualY += 2

		// Clear the grid behind
		for (let x = 0; x < 14; x++) {
			for (let y = 0; y < 5; y++) {
				grid.changeGridColor(x + 2, y + this.actualY, 3)
			}
		}

		// Position the overlay
		let bruteForceTimeBabyOverlay = document.querySelector('.bruteForceTimeBabyOverlay')
		bruteForceTimeBabyOverlay.style.top = `calc(1px + 5.555vw * ${this.actualY} + 1px * ${this.actualY})`
		// Display information
		document.querySelector('.bruteForceTimeBabyOverlay .oldPassword .password').innerHTML = this.analyzedPassword.password
		document.querySelector('.bruteForceTimeBabyOverlay .newPassword .password').innerHTML = this.analyzedPassword.correction.newPassword
		document.querySelector('.bruteForceTimeBabyOverlay .oldPassword .time').innerHTML = this.analyzedPassword.bruteForceTime > 1 ? this.analyzedPassword.bruteForceTime.toString().toParsedTime() : 'INSTANTLY'
		document.querySelector('.bruteForceTimeBabyOverlay .newPassword .time').innerHTML = this.analyzedPassword.correction.bruteForceTime.toString().toParsedTime()
		// Select bars for stagger animation
		let oldPasswordBars = document.querySelectorAll('.bruteForceTimeBabyOverlay .oldPassword .bar')
		let newPasswordsBars = document.querySelectorAll('.bruteForceTimeBabyOverlay .newPassword .bar')

		let displayBruteForceTimeBabyOverlay = () => {
			// Trigger staggers
			gsap.fromTo(
				oldPasswordBars,
				{
					scaleY: 0,
				},
				{
					duration: (this.analyzedPassword.bruteForceTime < 0.1 ? 0.1 : this.analyzedPassword.bruteForceTime) / 30,
					scaleY: 1,
					repeat: -1,
					ease: Linear.easeNone,
					stagger: {
						each: (this.analyzedPassword.bruteForceTime < 0.1 ? 0.1 : this.analyzedPassword.bruteForceTime) / 30,
					},
				}
			)
			gsap.fromTo(
				newPasswordsBars,
				{
					scaleY: 0,
				},
				{
					duration: this.analyzedPassword.correction.bruteForceTime / 30,
					scaleY: 1,
					repeat: -1,
					ease: Linear.easeNone,
					stagger: {
						each: this.analyzedPassword.correction.bruteForceTime / 30,
					},
				}
			)
			// Display the overlay
			gsap.to(bruteForceTimeBabyOverlay, 0.4, { opacity: 1 })
		}
		scrollDidsplayer.add(this.actualY, displayBruteForceTimeBabyOverlay)

		this.actualY += 7

		for (let i = 0; i < grid.width; i++) {
			grid.changeGridColor(i, this.actualY, 2)
		}

		this.actualY += 2

		// Display 10 million infos
		grid.displayWord({ x: 4, y: this.actualY, word: '10', minLength: 3, maxLength: 10, delay: 200 })
		grid.displayWord({ x: 7, y: this.actualY, word: 'MILLION', minLength: 3, maxLength: 10, delay: 200, color: 1 })

		this.actualY += 1

		let dbTextInfo = document.querySelector('p')
		dbTextInfo.innerHTML = 'The following data is extracted from a 10 <span style="color: var(--yellow)">million</span> passwords database. This data was shared for research purpose.'
		grid.setupBabyOverlay({ x: 4, y: this.actualY, width: 10, height: 3, className: 'dbInfo', content: dbTextInfo })

		this.actualY += 4

		// Display occurences
		let y3 = this.actualY

		let exactOccurences = document.createElement('p')
		exactOccurences.innerHTML = 'EXACT OCCURENCES'
		grid.setupBabyOverlay({ x: 2, y: y3, width: 6, height: 1, className: 'redLabelBabyOverlay', content: exactOccurences })

		let partialOccurences = document.createElement('p')
		partialOccurences.innerHTML = 'PARTIAL OCCURENCES'
		grid.setupBabyOverlay({ x: 2, y: y3 + 2, width: 6, height: 1, className: 'yellowLabelBabyOverlay', content: partialOccurences })

		let occurencesInfo = document.createElement('p')
		occurencesInfo.innerHTML = 'These are the number of passwords that are <span style="color: var(--red);">the same</span> as yours and the number of passwords that have <span style="color: var(--yellow);">your keyword</span> in it.'
		let listInfo = document.createElement('p')
		listInfo.innerHTML = 'Check the list, we always find something funny :)'

		let occurencesDiv = document.createElement('div')
		occurencesDiv.appendChild(occurencesInfo)
		occurencesDiv.appendChild(listInfo)

		grid.setupBabyOverlay({ x: 10, y: y3, width: 6, height: 4, className: 'occurencesInfo', content: occurencesDiv })

		function displayOccurences() {
			console.log(navigation.analyzedPassword.databaseResponse.equalCount, navigation.analyzedPassword.databaseResponse.containsCount)
			gsap.to(exactOccurences, 0.4, { opacity: 1 })
			grid.displayWord({ x: 2, y: y3 + 1, word: navigation.analyzedPassword.databaseResponse.equalCount['COUNT(password)'], minLength: 3, maxLength: 10, delay: 200 })

			grid.displayWord({ x: 2, y: y3 + 3, word: navigation.analyzedPassword.databaseResponse.containsCount['COUNT(password)'], minLength: 3, maxLength: 10, delay: 200 })
			gsap.to(partialOccurences, 0.4, { opacity: 1 })
		}
		scrollDidsplayer.add(y3, displayOccurences)

		this.actualY += 5

		let passwordIndex = 0
		console.log(this.analyzedPassword.databaseResponse.containsPasswords)
		for (const _password of this.analyzedPassword.databaseResponse.containsPasswords) {
			console.log(_password.password)

			let p = document.createElement('p')
			p.innerHTML = _password.password
			grid.setupBabyOverlay({ x: passwordIndex % 3 === 1 ? 12 : passwordIndex % 3 === 2 ? 7 : 2, y: this.actualY + Math.floor(passwordIndex / 3), width: 4, height: 1, className: 'labelBabyOverlay', content: p })
			passwordIndex++
		}
		console.log(Math.floor(passwordIndex / 3))
	},

	analyzePassword(input) {
		this.analyzedPassword.password = input

		// Analyse password with regex
		let upperCases = input.match(/[A-Z]/g)
		let lowerCases = input.match(/[a-z]/g)
		let specialCharacters = input.match(/[&()!?/\\*$¥€£#<>+\-%@§\'"`,:;.{}=]/g)
		let numbers = input.match(/[0-9]/g)

		// Define analyzedPassword with analyze result
		input.length < 8 ? (this.analyzedPassword.length = false) : (this.analyzedPassword.length = true)
		upperCases === null ? (this.analyzedPassword.upperCases = false) : (this.analyzedPassword.upperCases = true)
		lowerCases === null ? (this.analyzedPassword.lowerCases = false) : (this.analyzedPassword.lowerCases = true)
		specialCharacters === null ? (this.analyzedPassword.specialCharacters = false) : (this.analyzedPassword.specialCharacters = true)
		numbers === null ? (this.analyzedPassword.numbers = false) : (this.analyzedPassword.numbers = true)

		// Calculate password strength
		this.analyzedPassword.strength = new PasswordMeter().getResult(input).percent

		// Recreate new passwords
		let lowerCasesArray = 'abcdefghijklmnopqrstuvwxyz'
		let upperCasesArray = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
		let numbersArray = '0123456789'
		let specialCharactersArray = '&()!?/\\*$¥€£#<>+-%@§\'"`,:;.{}='

		this.analyzedPassword.correction = {}
		let newPassword = input

		// Length
		if (!this.analyzedPassword.length) {
			let numberToAdd = 8 - newPassword.length
			for (let index = 0; index < numberToAdd; index++) {
				let randomLetter = lowerCasesArray[Math.floor(Math.random() * lowerCasesArray.length)]
				newPassword = newPassword.concat(randomLetter)
			}
			this.analyzedPassword.correction.length = {}
			this.analyzedPassword.correction.length.password = newPassword
			this.analyzedPassword.correction.length.strength = new PasswordMeter().getResult(newPassword).percent
		}
		// Lower cases
		if (!this.analyzedPassword.lowerCases && this.analyzedPassword.length) {
			let randomLetter = lowerCasesArray[Math.floor(Math.random() * lowerCasesArray.length)]
			newPassword = newPassword.concat(randomLetter)

			this.analyzedPassword.correction.lowerCases = {}
			this.analyzedPassword.correction.lowerCases.password = newPassword
			this.analyzedPassword.correction.lowerCases.strength = new PasswordMeter().getResult(newPassword).percent
		}
		// Upper cases
		if (!this.analyzedPassword.upperCases) {
			let randomPos = Math.floor(Math.random() * newPassword.length)
			while (newPassword[randomPos] === newPassword[randomPos].toUpperCase()) {
				randomPos = Math.floor(Math.random() * newPassword.length)
			}

			newPassword = newPassword.replace(newPassword[randomPos], newPassword[randomPos].toUpperCase())

			this.analyzedPassword.correction.upperCases = {}
			this.analyzedPassword.correction.upperCases.password = newPassword
			this.analyzedPassword.correction.upperCases.strength = new PasswordMeter().getResult(newPassword).percent
		}
		// Numbers
		if (!this.analyzedPassword.numbers) {
			let randomNumber = numbersArray[Math.floor(Math.random() * numbersArray.length)]
			newPassword = newPassword.concat(randomNumber)

			this.analyzedPassword.correction.numbers = {}
			this.analyzedPassword.correction.numbers.password = newPassword
			this.analyzedPassword.correction.numbers.strength = new PasswordMeter().getResult(newPassword).percent
		}
		// Specialcharacters
		if (!this.analyzedPassword.specialCharacters) {
			let passwordRef = newPassword

			newPassword = newPassword.replace('a', '@')
			newPassword = newPassword.replace('i', '!')
			newPassword = newPassword.replace('l', '/')
			newPassword = newPassword.replace('e', '€')
			newPassword = newPassword.replace('y', '¥')
			newPassword = newPassword.replace('s', '$')

			if (passwordRef === newPassword) {
				let randomSpecialCharacter = specialCharactersArray[Math.floor(Math.random() * specialCharactersArray.length)]
				newPassword = newPassword.concat(randomSpecialCharacter)
			}

			this.analyzedPassword.correction.specialCharacters = {}
			this.analyzedPassword.correction.specialCharacters.password = newPassword
			this.analyzedPassword.correction.specialCharacters.strength = new PasswordMeter().getResult(newPassword).percent
		}
		this.analyzedPassword.correction.newPassword = newPassword

		// Calculate brute force time to crack
		this.analyzedPassword.bruteForceTime = calculateBruteforceTime(input)
		this.analyzedPassword.correction.bruteForceTime = calculateBruteforceTime(newPassword)

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

let scrollDidsplayer = {
	targets: [],

	setup() {
		window.addEventListener('scroll', () => {
			for (const _target of this.targets) {
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

// Time converter function

String.prototype.toParsedTime = function () {
	let sec_num = parseInt(this, 10) // don't forget the second param
	let hours = Math.floor(sec_num / 3600)
	let minutes = Math.floor((sec_num - hours * 3600) / 60)
	let seconds = sec_num - hours * 3600 - minutes * 60

	if (hours < 10) {
		hours = '0' + hours
	}
	if (minutes < 10) {
		minutes = '0' + minutes
	}
	if (seconds < 10) {
		seconds = '0' + seconds
	}

	if (parseInt(hours) === 0 && parseInt(minutes) === 0) {
		return seconds + '"'
	}
	if (parseInt(hours) === 0) {
		return minutes + "'" + seconds + '"'
	}
	if (parseInt(hours) < 24) {
		return hours + 'H ' + minutes + "'" + seconds + '"'
	}
	let day = Math.floor(hours / 24)
	if (day < 365) {
		return day + 'D ' + (hours % 24) + 'H ' + minutes + "'" + seconds + '"'
	}
	if (day > 365) {
		return Math.floor(day / 365) + 'Y ' + (day % 365) + 'D ' + (hours % 24) + 'H ' + minutes + "'" + seconds + '"'
	}
}

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
