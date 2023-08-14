const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver;

suite('Unit Tests', () => {
    let input = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
    solver.populateBoard(input);
    
    suite('Test validate() function', () => {
        let invalidCharacters = '..9..5.1.85.4..A.2432....V.1...69.80.9.....6.62.71...(!NA$)...15....4.37.4.3..6..'
        let inputTooShort = '..432..'
        let inputTooLong = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6....543..12..94232423'
        
        test('81 characters, all valid', function(done) {
            let result = solver.validate(input);
            assert.isBoolean(result);
            assert.isTrue(result);
            done();
        }) 
        test('81 characters, including invalid characters', function(done) {
            
            assert.throw(() => solver.validate(invalidCharacters), 'Invalid characters in puzzle')
            done();
        })
        test('Input not 81 characters long', function(done) {

            assert.throw(() => solver.validate(inputTooShort), 'Expected puzzle to be 81 characters long');
            assert.throw(() => solver.validate(inputTooLong), 'Expected puzzle to be 81 characters long');

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
            let result = solver.checkColPlacement(input, row, column, value);
            assert.isBoolean(result);
            assert.isTrue(result);
            done();
        })
        test('Invalid input', function(done){
            let row = 'E';
            let column = 3;
            let value = 9;
            let result = solver.checkColPlacement(input, row, column, value);
            assert.isBoolean(result);
            assert.isFalse(result);
            done();
        })

    })
    suite('Test checkRegionPlacement(puzzleString, row, column, value)', function(done){
        test('Valid input', function(done){
            let row = 'A';
            let column = 1;
            let value = 7;
            let result1 = solver.checkRegionPlacement(input, row, column, value);

            row = 'C';
            column = 8;
            value = 2;
            let result2 = solver.checkRegionPlacement(input, row, column, value);

            assert.isBoolean(result1);
            assert.isBoolean(result2);
            assert.isTrue(result1);
            assert.isFalse(result2);
            done();
        })
        test('Invalid input', function(done){
            let row = 'Z';
            let column = 0;
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
            done();
        })
        test('Invalid input', function(done){
            let invalidInput = '1.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
            
            assert.throw(() => solver.solve(invalidInput), 'Puzzle cannot be solved')
            done();
        })
        test('Return correct result', function(done) {
            let expected = '769235418851496372432178956174569283395842761628713549283657194516924837947381625'
            let result = solver.solve(input);
            assert.isString(result);
            assert.equal(result, expected);
            done()
        })

    })
});
