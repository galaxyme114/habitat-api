const express = require('express');
const constantsController = require('../../controllers/constants.controller');

const router = express.Router();

router.route('/').get(constantsController.get);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Constants
 *   description: Contstants Retrieval
 */

/**
 * @swagger
 * path:
 *  /constants:
 *    get:
 *      summary: Get all constants
 *      tags: [Constants]
 *      security:
 *        - bearerAuth: []
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
 *                      $ref: '#/components/schemas/Constants'
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
