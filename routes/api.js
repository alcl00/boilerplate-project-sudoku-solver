'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function(app) {

  let solver = new SudokuSolver();
  let validRow = /[A-I]/
  let validColumn = /[1-9]/

  let findConflicts = (puzzleString, row, column, value) => {
    let conflicts = [];

    if (!solver.checkRowPlacement(puzzleString, row, column, value)) {
      conflicts.push("row")
    }
    if (!solver.checkColPlacement(puzzleString, row, column, value)) {
      conflicts.push("column")
    }
    if (!solver.checkRegionPlacement(puzzleString, row, column, value)) {
      conflicts.push("region")
    }

    return conflicts;
  };

  app.route('/api/check')
    .post((req, res) => {
      if (!(req.body.puzzle && req.body.coordinate && req.body.value)) {
        res.json({ error: 'Required field(s) missing' })
        return;
      }
      try {
        
        if(!(/[1-9]/.test(req.body.value))) {
          res.json({ error: 'Invalid value' })
          return
        }
        let value = parseInt(req.body.value);
        if ((value < 1 || value > 9)) {
          res.json({ error: 'Invalid value' })
          return
        }
        
        if (req.body.coordinate.length !== 2) {
          res.json({ error: 'Invalid coordinate' })
          return;
        }
        solver.validate(req.body.puzzle);

        solver.populateBoard(req.body.puzzle);

        
        let row = req.body.coordinate.charAt(0);
        let column = req.body.coordinate.charAt(1);
        if (!(validColumn.test(column) && validRow.test(row))) {
          res.json({ error: 'Invalid coordinate' })
          return;
        }

        let conflicts = findConflicts(req.body.puzzle, row, column, value);

        if (conflicts.length !== 0) {
          res.json({ valid: false, conflict: conflicts });
          return
        }
        res.json({ valid: true });

      }
      catch (err) {
        res.json({ error: err })
      }



    });

  app.route('/api/solve')
    .post((req, res) => {
      if (!req.body.puzzle) {
        res.json({ error: 'Required field missing' })
        return
      }
      else {
        try {
          solver.validate(req.body.puzzle);
          let solutionString = solver.solve(req.body.puzzle);
          res.json({ solution: solutionString });
          return;
        }
        catch (err) {
          res.json({ error: err });
          return;
        }
      }

    });
};
