const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { noteService, projectService } = require('../services');

const createNoteForProject = catchAsync(async (req, res) => {
  const note = await noteService.createNote({ ...req.body });
  await projectService.addNoteToProject(req.body.project, note.id);
  res.status(httpStatus.CREATED).send(note);
});

const updateNote = catchAsync(async (req, res) => {
  const note = await noteService.updateNoteById(req.params.noteId, req.body);
  res.status(httpStatus.CREATED).send(note);
});

const deleteNote = catchAsync(async (req, res) => {
  await noteService.deleteNoteById(req.params.noteId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createNoteForProject,
  updateNote,
  deleteNote,
};
