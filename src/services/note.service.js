const httpStatus = require('http-status');
const { Note } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Get note by id
 * @param {ObjectId} id
 * @returns {Promise<Note>}
 */
const getNoteById = async (id) => {
  return Note.findById(id)
    .populate({ path: 'owner', populate: { path: 'image' } })
    .populate({ path: 'project', populate: { path: 'habitat' } });
};

/**
 * Create Note
 * @param {Object} noteBody
 * @returns {Promise<Note>}
 */
const createNote = async (noteBody) => {
  const note = await Note.create(noteBody);
  return note;
};

/**
 * Update note by id
 * @param {ObjectId} noteId
 * @param {Object} noteBody
 * @returns {Promise<Note>}
 */
const updateNoteById = async (noteId, noteBody) => {
  const note = await getNoteById(noteId);
  if (!note) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Note not found');
  }
  note.text = noteBody.text;
  note.colour = noteBody.colour;
  await note.save();
  return note;
};

/**
 * Delete note by id
 * @param {ObjectId} noteId
 * @returns {Promise<Note>}
 */
const deleteNoteById = async (noteId) => {
  const note = await getNoteById(noteId);
  if (!note) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Note not found');
  }

  // TODO Remove habitats from all associated users, and delete all media and other associated data
  // TODO Check if habitats is current and also remove that. Should this process be attached to the model?

  await note.remove();
  return note;
};

module.exports = {
  getNoteById,
  createNote,
  updateNoteById,
  deleteNoteById,
};
