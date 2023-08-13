'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      if(!(req.body.puzzle && req.body.coordinate && req.body.value)) {
        res.json({ error: })
      }
      res.json({});
    });
    
  app.route('/api/solve')
    .post((req, res) => {
      if(!req.body.puzzle) {
        res.json({ error: 'Required field missing' })
      }
      else {
        try{
          solver.validate(req.body.puzzle);
          let solutionString = solver.solve(req.body.puzzle);
          res.json({ solution: solutionString });
        }
        catch(err) {
          res.json({ error: err });
        }
      }
      
    });
};
