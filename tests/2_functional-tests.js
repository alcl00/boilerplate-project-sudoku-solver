const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {

    let input = '5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3'
    let solution = '135762984946381257728459613694517832812936745357824196473298561581673429269145378';
    suite('POST /api/solve => solve given puzzle string', function() {
        test('Valid puzzle string', function(done) {
            //Must return solution property with solution string
            
            chai.request(server)
            .keepOpen()
            .post('/api/solve')
            .send({
                puzzle: input
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.property(res.body, 'solution', 'POST should return property solution');
                assert.equal(res.body.solution, solution);
                done();
            })
        });
        test('Missing puzzle string', function(done) {
            //Must return { error:  }
            chai.request(server)
            .keepOpen()
            .post('/api/solve')
            .send({})
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.property(res.body, 'error', 'POST should return property error');
                assert.equal(res.body.error, 'Required field missing');
                done();
            })
        });
        test('Invalid characters', function(done) {
            let invalidInput = '5..91372.3...8.5.9.9.25..8.68.47.23$..9%..AB.7.4.....5.2.......4..8916..85.72...3'
            chai.request(server)
            .keepOpen()
            .post('/api/solve')
            .send({
                puzzle: invalidInput
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.property(res.body, 'error', 'POST should return property error');
                assert.equal(res.body.error, 'Invalid characters in puzzle');
                done();
            })
        });
        test('Incorrect length (not 81 characters long)', function(done) {
            // error: 'Expected puzzle to be 81 characters long' }
            let shortInput = '123...'
            let longInput = '5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3..1234...12388888....'
            
            chai.request(server)
            .keepOpen()
            .post('/api/solve')
            .send({
                puzzle: shortInput
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.property(res.body, 'error', 'POST should return property error');
                assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
                done();
            })

            chai.request(server)
            .keepOpen()
            .post('/api/solve')
            .send({
                puzzle: longInput
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.property(res.body, 'error', 'POST should return property error');
                assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
                done();
            })
        });
        test('Puzzle cannot be solved', function(done) {
            let invalidInput = '59.91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3'

            chai.request(server)
            .keepOpen()
            .post('/api/solve')
            .send({
                puzzle: invalidInput
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.property(res.body, 'error', 'POST should return property error');
                assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
                done();
            })
        });
    });
    suite('POST /api/check => check puzzle placement', function(){

        //All fields
        test('All fields', function(done) {
            let coordinate = 'C1';
            let value = 1;
            chai.request(server)
            .keepOpen()
            .post('/api/check')
            .send({
                "puzzle": input,
                "coordinate": coordinate,
                "value": value
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.property(res.body, 'valid', 'POST should return property valid');
                assert.isBoolean(res.body.valid);
                assert.isTrue(res.body.valid);
                done();
            })
        });
        // Check a puzzle placement with single placement conflict: POST request to /api/check
        test('Single placement conflict', function(done) {
            let coordinate = 'C1';
            let value = 6;
            chai.request(server)
            .keepOpen()
            .post('/api/check')
            .send({
                "puzzle": input,
                "coordinate": coordinate,
                "value": value
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.property(res.body, 'valid', 'POST should return property valid');
                assert.property(res.body, 'conflict', 'POST should return property conflict');
                assert.isBoolean(res.body.valid);
                assert.isArray(res.body.conflict);
                assert.isNotTrue(res.body.valid);
                assert.equal(res.body.conflict.length, 1);
                done();
            })
        });
        // Check a puzzle placement with multiple placement conflicts: POST request to /api/check
        test('Multiple placement conflicts', function(done) {
            let coordinate = 'C1';
            let value = 9;
            chai.request(server)
            .keepOpen()
            .post('/api/check')
            .send({
                "puzzle": input,
                "coordinate": coordinate,
                "value": value
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.property(res.body, 'valid', 'POST should return property valid');
                assert.property(res.body, 'conflict', 'POST should return property conflict');
                assert.isBoolean(res.body.valid);
                assert.isArray(res.body.conflict);
                assert.isNotTrue(res.body.valid);
                assert.equal(res.body.conflict.length, 2);
                done();
            })
        });
        // Check a puzzle placement with all placement conflicts: POST request to /api/check
        test('All placement conflicts', function(done){
            let coordinate = 'C9';
            let value = 9;
            chai.request(server)
            .keepOpen()
            .post('/api/check')
            .send({
                "puzzle": input,
                "coordinate": coordinate,
                "value": value
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.property(res.body, 'valid', 'POST should return property valid');
                assert.property(res.body, 'conflict', 'POST should return property conflict');
                assert.isBoolean(res.body.valid);
                assert.isArray(res.body.conflict);
                assert.isNotTrue(res.body.valid);
                assert.equal(res.body.conflict.length, 3);
                done();
            })
        })
        // Check a puzzle placement with missing required fields: POST request to /api/check
        test('Missing required fields', function(done) {
            //{ error: 'Required field(s) missing' }
            chai.request(server)
            .keepOpen()
            .post('/api/check')
            .send({})
            .end((err, res) => {
                assert.equal(res.status, 200)
                assert.property(res.body, 'error', 'POST should return property error');
                assert.equal(res.body.error, 'Required field(s) missing');
                done();
            })
        })
        // Check a puzzle placement with invalid characters: POST request to /api/check
        test('Invalid characters', function(done) {
            let invalidInput = '5..91372.3...8.5.9.9.25..8.68.47.23$..9%..AB.7.4.....5.2.......4..8916..85.72...3';
            let coordinate = 'C1';
            let value = 9;
            chai.request(server)
            .keepOpen()
            .post('/api/check')
            .send({
                "puzzle": invalidInput,
                "coordinate": coordinate,
                "value": value
            })
            .end((err, res) => {
                assert.equal(res.status, 200)
                assert.property(res.body, 'error', 'POST should return property error');
                assert.equal(res.body.error, 'Invalid characters in puzzle');
                done();
            })
        })
        // Check a puzzle placement with incorrect length: POST request to /api/check
        test('Incorrect length (not 81 characters)', function(done) {
            let shortInput = '123...'
            let longInput = '5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3..1234...12388888....'
            let coordinate = 'C1';
            let value = 9;
            chai.request(server)
            .keepOpen()
            .post('/api/check')
            .send({
                "puzzle": longInput,
                "coordinate": coordinate,
                "value": value
            })
            .end((err, res) => {
                assert.equal(res.status, 200)
                assert.property(res.body, 'error', 'POST should return property error');
                assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
                done();
            })
            chai.request(server)
            .keepOpen()
            .post('/api/check')
            .send({
                "puzzle": shortInput,
                "coordinate": coordinate,
                "value": value
            })
            .end((err, res) => {
                assert.equal(res.status, 200)
                assert.property(res.body, 'error', 'POST should return property error');
                assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
                done();
            })

        })
        // Check a puzzle placement with invalid placement coordinate: POST request to /api/check
        test('Invalid placement coordinate', function(done) {
            let coordinate = 'Z1';
            let value = 1;

            chai.request(server)
            .keepOpen()
            .post('/api/check')
            .send({
                "puzzle": input,
                "coordinate": coordinate,
                "value": value
            })
            .end((err, res) => {
                assert.equal(res.status, 200)
                assert.property(res.body, 'error', 'POST should return property error');
                assert.equal(res.body.error, 'Invalid coordinate');
                done();
            })
        })
        // Check a puzzle placement with invalid placement value: POST request to /api/check
        test('Invalid placement value', function(done) {
            let coordinate = 'Z1';
            let value = 20;

            chai.request(server)
            .keepOpen()
            .post('/api/check')
            .send({
                "puzzle": input,
                "coordinate": coordinate,
                "value": value
            })
            .end((err, res) => {
                assert.equal(res.status, 200)
                assert.property(res.body, 'error', 'POST should return property error');
                assert.equal(res.body.error, 'Invalid coordinate');
                done();
            })
        })
    })
});

