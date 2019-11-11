module.exports = {
    "env": {
        "es6": true,
        "node": true,
        "jest": true,
    },
    "extends": "eslint:recommended",
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "rules": {
        "comma-dangle": ["warn", "always-multiline"],
        "comma-spacing": ["warn", {"before": false, "after": true}],
        "global-require": "error",
        "no-unused-vars": 1,
        "quotes": ["warn", "single"],
        "semi": ["warn", "always"],
    }
};