var express = require('express');
var router = express.Router();
const controller = require('../controllers/commentController');
const jwt = require('express-jwt');
const response = require('../lib/response_handler');

require('dotenv').config();

router.use(jwt({
      secret: process.env.JWT_SECRET_KEY,
      algorithms: ['HS256'] 
}).unless({
      path: [
            {
                  url: '/comments', methods: ['GET']
            },
            {
                  url: /^\/comments\/.*/, methods: ['GET'] // Read more about regex
            }
      ]
}));

router.use((err, req, res, next) => {
      console.log(err.name);
      if (err.name === 'UnauthorizedError') {
            response(res, 401, 'Unauthorized access');
      }
})

/**
 * @swagger
 * /comments:
 *     get:
 *           tags:
 *                - comments
 *           description: Text
 *           responses:
 *                 200:
 *                       description: Successful
*/
router.get('/', controller.getAll)

/**
 * @swagger
 * /comments:
 *   post:
 *     tags:
 *          - comments
 *     summary: Create comment
 *     security:
 *          - bearerAuth: []
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - content
 *            properties:
 *              content:
 *                type: string
 *                default: Food is amazing
 *     responses:
 *      201:
 *        description: Created
 *      500:
 *        description: Error
 * components:
 *  securitySchemes:
 *   bearerAuth:
 *     type: http
 *     scheme: bearer
 *     bearerFormat: JWT 
 */
router.post('/', controller.postCreate)

/**
 * @swagger
 * /comments/{id}:
 *  get:
 *    tags:
 *          - comments
 *    summary: Get comment by id
 *    description: Get method to show all comments
 *    parameters:
 *      - name: id
 *        in: path
 *        description: ID of a comment in database
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: Successful response
 */
router.get('/:id', controller.getById)

/**
 * @swagger
 * /comments/{id}/update:
 *   post:
 *     tags:
 *          - comments
 *     summary: Update comment
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *      - name: id
 *        in: path
 *        description: ID of a comment in database
 *        required: true
 *        schema:
 *          type: string
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - content
 *            properties:
 *              content:
 *                type: string
 *                default: Food is amazing
 *     responses:
 *      201:
 *        description: Updated
 *      500:
 *        description: Error
 * components:
 *  securitySchemes:
 *   bearerAuth:
 *     type: http
 *     scheme: bearer
 *     bearerFormat: JWT  # optional, for documentation purposes only
 *
 *
 */
router.post('/:id/update', controller.postUpdate)

/**
 * @swagger
 * /comments/{id}:
 *  delete:
 *    tags:
 *          - comments
 *    summary: Delete post by id
 *    description: Delete method to delete comment by id
 *    security:
 *          - bearerAuth: []
 *    parameters:
 *      - name: id
 *        in: path
 *        description: ID of a comment in database
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: Successful response
 * components:
 *  securitySchemes:
 *   bearerAuth:
 *     type: http
 *     scheme: bearer
 *     bearerFormat: JWT 
 */
router.delete('/:id', controller.getDeleted)

module.exports = router;