const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver;

suite('Unit Tests', () => {
    let input = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
    
    suite('Test validate() function', () => {
        let invalidCharacters = '..9..5.1.85.4..A.2432....V.1...69.80.9.....6.62.71...(!NA$)...1945....4.37.4.3..6..'
        let inputTooShort = '..432..'
        let inputTooLong = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6....543..12..94232423'
        test('81 characters, all valid', function(done) {
            let result = solver.validate(input);
            assert.isBoolean(result);
            assert.isTrue(result);
            done();
        }) 
        test('81 characters, including invalid characters', function(done) {
            let result = solver.validate(invalidCharacters);
            assert.isBoolean(result);
            assert.isFalse(result);
            done();
        })
        test('Input not 81 characters long', function(done) {
            let resultTooShort = solver.validate(inputTooShort);
            let resulttooLong = solver.validate(inputTooLong);

            assert.isBoolean(resultTooShort);
            assert.isBoolean(resulttooLong);

            assert.isFalse(resultTooShort);
            assert.isFalse(resulttooLong);
            done();
        })
    })
    suite('Test checkRowPlacement(puzzleString, row, column, value)', function(done){
        test('Valid input', function(done){
            let row = 'A';
            let column = 1;
            let value = 7;
            let result = solver.checkRowPlacement(input, row, column, value);
            assert.isBoolean(result);
            assert.isTrue(result);
            done();
        })
        test('Invalid input', function(done){
            let row = 'E';
            let column = 3;
            let value = 9;
            let result = solver.checkRowPlacement(input, row, column, value);
            assert.isBoolean(result);
            assert.isFalse(result);
            done();
        })

    })
    suite('Test checkColumPlacement(puzzleString, row, column, value)', function(done){
        test('Valid input', function(done){
            let row = 'A';
            let column = 1;
            let value = 7;
            let result = solver.checkColumnPlacement(input, row, column, value);
            assert.isBoolean(result);
            assert.isTrue(result);
            done();
        })
        test('Invalid input', function(done){
            let row = 'E';
            let column = 3;
            let value = 9;
            let result = solver.checkRowPlacement(input, row, column, value);
            assert.isBoolean(result);
            assert.isFalse(result);
            done();
        })

    })
    suite('Test checkRegionPlacement(puzzleString, row, column, value)', function(done){
        test('Valid input', function(done){
            let row = 'I';
            let column = 5;
            let value = 5;
            let result = solver.checkColumnPlacement(input, row, column, value);
            assert.isBoolean(result);
            assert.isTrue(result);
            done();
        })
        test('Invalid input', function(done){
            let row = 'C';
            let column = 8;
            let value = 2;
            let result = solver.checkRegionPlacement(input, row, column, value);
            assert.isBoolean(result);
            assert.isFalse(result);
            done();
        })

    })
    suite('Test solve(puzzleString)', function(done){
        test('Valid input', function(done){
            let result = solver.solve(input);
            assert.isString(result);
            assert.equal(result, 'Puzzle cannot be solved');
            done();
        })
        test('Invalid input', function(done){
            let invalidInput = '1.9..5.1.85.4....2432....5.1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
            let result = solver.solve(invalidInput);
            assert.isString(result);
            assert.equal(result, 'Puzzle cannot be solved');
            done();
        })
        test('Return correct result', function(done) {
            let expected = '769235418851496372432178956174569283395842761628713549283657194516924837947381625'
            let result = solver.solve(input);
            assert.isString(result);
            assert.equal(result, expected);
        })

    })
});
