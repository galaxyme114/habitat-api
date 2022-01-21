const express = require('express');
const auth = require('../../middlewares/auth');
const authHabitat = require('../../middlewares/auth-habitat');
const authHabitatUsers = require('../../middlewares/auth-habitat-users');
const validate = require('../../middlewares/validate');
const habitatValidation = require('../../validations/habitat.validation');
const habitatController = require('../../controllers/habitat.controller');

const router = express.Router();

router
  .route('/')
  .post(auth(), validate(habitatValidation.createHabitat), habitatController.createHabitatForUser)
  .get(auth(), validate(habitatValidation.getHabitats), habitatController.getHabitatsForUser);

router.route('/accept-invite').post(auth(), habitatController.acceptHabitatInvite);

router.route('/archived').get(auth(), habitatController.getArchivedHabitats);

router
  .route('/:habitatId')
  .get(auth(), authHabitat(), validate(habitatValidation.getHabitat), habitatController.getHabitat)
  .patch(auth(), authHabitat(), validate(habitatValidation.updateHabitat), habitatController.updateHabitat)
  .delete(auth(), authHabitat(), validate(habitatValidation.deleteHabitat), habitatController.deleteHabitat);

router
  .route('/:habitatId/users')
  .post(auth(), authHabitatUsers(), habitatController.addUserToHabitat)
  .delete(auth(), authHabitatUsers(), habitatController.removeUserFromHabitat);

router.route('/inspiration/:habitatId').get(auth(), habitatController.getInspiration);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Habitats
 *   description: Habitat management and retrieval
 */

/**
 * @swagger
 * path:
 *  /habitats:
 *    post:
 *      summary: Create a habitats for the authenticated user
 *      description:
 *      tags: [Habitats]
 *      security:
 *        - bearerAuth: []
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - name
 *                - owner
 *              properties:
 *                name:
 *                  type: string
 *                owner:
 *                  type: objectId
 *                users:
 *                  [type: objectId]
 *              example:
 *                name: fake name
 *                owner: 123
 *                users: [456, 789]
 *      responses:
 *        "201":
 *          description: Created
 *          content:
 *            application/json:
 *              schema:
 *                 $ref: '#/components/schemas/Habitat'
 *        "401":
 *          $ref: '#/components/responses/Unauthorized'
 *        "403":
 *          $ref: '#/components/responses/Forbidden'
 *
 *    get:
 *      summary: Get all habitats available for the authenticated user
 *      description:
 *      tags: [Habitats]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: query
 *          name: name
 *          schema:
 *            type: string
 *          description: Habitat name
 *        - in: query
 *          name: sortBy
 *          schema:
 *            type: string
 *          description: sort by query in the form of field:desc/asc (ex. name:asc)
 *        - in: query
 *          name: limit
 *          schema:
 *            type: integer
 *            minimum: 1
 *          default: 10
 *          description: Maximum number of habitats
 *        - in: query
 *          name: page
 *          schema:
 *            type: integer
 *            minimum: 1
 *            default: 1
 *          description: Page number
 *      responses:
 *        "200":
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  results:
 *                    type: array
 *                    items:
 *                      $ref: '#/components/schemas/Habitat'
 *                  page:
 *                    type: integer
 *                    example: 1
 *                  limit:
 *                    type: integer
 *                    example: 10
 *                  totalPages:
 *                    type: integer
 *                    example: 1
 *                  totalResults:
 *                    type: integer
 *                    example: 1
 *        "401":
 *          $ref: '#/components/responses/Unauthorized'
 *        "403":
 *          $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * path:
 *  /habitats/{id}:
 *    get:
 *      summary: Get a habitats for a user
 *      description:
 *      tags: [Habitats]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: string
 *          description: Habitat id
 *      responses:
 *        "200":
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                 $ref: '#/components/schemas/Habitat'
 *        "401":
 *          $ref: '#/components/responses/Unauthorized'
 *        "403":
 *          $ref: '#/components/responses/Forbidden'
 *        "404":
 *          $ref: '#/components/responses/NotFound'
 *
 *    patch:
 *      summary: Update a habitats
 *      description:
 *      tags: [Habitats]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: string
 *          description: Habitat id
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                name:
 *                  type: string
 *                owner:
 *                  type: objectID
 *                users:
 *                  [type: objectId]
 *              example:
 *                name: fake name
 *                owner: 123
 *                users: [456, 789]
 *      responses:
 *        "200":
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                 $ref: '#/components/schemas/Habitat'
 *        "401":
 *          $ref: '#/components/responses/Unauthorized'
 *        "403":
 *          $ref: '#/components/responses/Forbidden'
 *        "404":
 *          $ref: '#/components/responses/NotFound'
 *
 *    delete:
 *      summary: Delete a habitats
 *      description:
 *      tags: [Habitats]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: string
 *          description: Habitat id
 *      responses:
 *        "200":
 *          description: No content
 *        "401":
 *          $ref: '#/components/responses/Unauthorized'
 *        "403":
 *          $ref: '#/components/responses/Forbidden'
 *        "404":
 *          $ref: '#/components/responses/NotFound'
 */
