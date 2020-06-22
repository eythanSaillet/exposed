// Code from : https://github.com/schiru/mini-password-bruteforce-time-calculator

calculatorConfig = {
	calculationsPerSecond: 10e9,

	// Match patterns for specific types of characters
	// Contains regex and impact on calculation time (adds x possibilities if pattern matches)
	tests: [
		{
			title: 'lowercase letters',
			regex: /[a-z]/,
			addsPossibilities: 26,
		},
		{
			title: 'uppercase characters',
			regex: /[A-Z]/,
			addsPossibilities: 26,
		},
		{
			title: 'numbers',
			regex: /[0-9]/,
			addsPossibilities: 10,
		},
		{
			title: 'special characters',
			regex: /[!@#$%^&*\(\\\)\-\_=+[{ \]};:'"\|`~,<.>\/? ]/,
			addsPossibilities: 33,
		},
	],
}

/**
 * Calculates the number of possibilities per character
 * based on what kind of characters are included in the given password.
 *
 * For "abc", the possibilities per character would be 26, whereas for "abc1" the pbc would be 36
 * @param {string} password
 * @return {int} number of possibilities per character
 */
function calculatePossibilitiesPerCharacter(password) {
	let possibilities = 0

	calculatorConfig.tests.forEach((test) => {
		if (password.match(test.regex) != null) {
			// console.log(`matches group: ${test.title}`);
			possibilities += test.addsPossibilities
		}
	})

	return possibilities
}

/**
 * Calculates the time required to brute-force the given password in seconds
 * @param {string} password
 * @return {number} required time in seconds
 */
calculateBruteforceTime = (password) => {
	let possibilities = calculatePossibilitiesPerCharacter(password)

	return Math.pow(possibilities, password.length) / calculatorConfig.calculationsPerSecond
}
