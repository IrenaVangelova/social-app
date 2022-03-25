var express = require('express');
var router = express.Router();
const controller = require('../controllers/posts');
const jwt = require('express-jwt');
const response = require('../lib/response_handler');

require('dotenv').config();

router.use(jwt({
      secret: process.env.JWT_SECRET_KEY,
      algorithms: ['HS256'] 
}).unless({
      path: [
            {
                  url: '/posts', methods: ['GET']
            },
            {
                  url: /^\/posts\/.*/, methods: ['GET'] // Read more about regex
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
 * /posts:
 *     get:
 *           tags:
 *                - posts
 *           description: Text
 *           responses:
 *                 200:
 *                       description: Successful
*/
router.get('/', controller.all)

/**
 * @swagger
 * /posts:
 *   post:
 *     tags:
 *          - posts
 *     summary: Create post
 *     security:
 *          - bearerAuth: []
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - title
 *              - content
 *              - user
 *            properties:
 *              title:
 *                type: string
 *                default: Food
 *              content:
 *                type: string
 *                default: Dessert
 *              user:
 *                type: string
 *                default: id of the user that created this post
 *     responses:
 *      201:
 *        description: Created
 *      400:
 *        description: post exists
 *      500:
 *        description: Error
 * components:
 *  securitySchemes:
 *   bearerAuth:
 *     type: http
 *     scheme: bearer
 *     bearerFormat: JWT 
 */
router.post('/', controller.create)

/**
 * @swagger
 * /posts/{id}:
 *  get:
 *    tags:
 *          - posts
 *    summary: Get user by id
 *    description: Get method to show all posts
 *    parameters:
 *      - name: id
 *        in: path
 *        description: ID of a post in database
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: Successful response
 */
router.get('/:id', controller.byId)

/**
 * @swagger
 * /posts/{id}/update:
 *   post:
 *     tags:
 *          - posts
 *     summary: Update post
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *      - name: id
 *        in: path
 *        description: ID of a post in database
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
 *              - title
 *              - content
 *            properties:
 *              title:
 *                type: string
 *                default: Food
 *              content:
 *                type: string
 *                default: Dessert
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
router.post('/:id/update', controller.update)

/**
 * @swagger
 * /posts/{id}:
 *  delete:
 *    tags:
 *          - posts
 *    summary: Delete post by id
 *    description: Delete method to delete post by id
 *    security:
 *          - bearerAuth: []
 *    parameters:
 *      - name: id
 *        in: path
 *        description: ID of a post in database
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
router.delete('/:id', controller.remove)

router.post('/:id/like', controller.likeAndDislike)


module.exports = router;