const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const notesController = require('../../controllers/note.controller');
const notesValidation = require('../../validations/note.validation');

const router = express.Router();

router.route('/').post(auth(), validate(notesValidation.createNote), notesController.createNoteForProject);
router
  .route('/:noteId')
  .patch(auth(), validate(notesValidation.updateNote), notesController.updateNote)
  .delete(auth(), validate(notesValidation.deleteNote), notesController.deleteNote);

module.exports = router;
