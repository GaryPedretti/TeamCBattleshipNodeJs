module.exports = {
    A: 1,
    B: 2,
    C: 3,
    D: 4,
    E: 5,
    F: 6,
    G: 7,
    H: 8,
    I: 9,
    J: 10,
    get(letter) {
        if (typeof letter === 'string') {
            return this[letter.toUpperCase()];
        }
        // Reverse lookup (convert number back to letter)
        const entry = Object.entries(this).find(([key, val]) => val === letter);
        return entry ? entry[0] : null;
    }
};
/*require('enum').register();

var Letters = new Enum({
    'A': 1,
    'B': 2,
    'C': 3,
    'D': 4,
    'E': 5,
    'F': 6,
    'G': 7,
    'H': 8
}, {
    ignoreCase: true
});

module.exports = Letters;*/