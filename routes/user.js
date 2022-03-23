var express = require('express');
var router = express.Router();
const controller = require('../controllers/userController');
const jwt = require('express-jwt');
const response = require('../lib/response_handler');


require('dotenv').config();

router.use(jwt({
      secret: process.env.JWT_SECRET_KEY,
      algorithms: ['HS256'] 
}).unless({
      path: [
            {
                  url: '/users', methods: ['POST']
            },
            {
                  url: '/users/login', methods: ['POST']
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
 * /users:
 *     get:
 *           tags:
 *                - users
 *           description: All users from database
 *           responses:
 *                 200:
 *                       description: Successful
*/
router.get('/', controller.all)

/**
 * @swagger
 * /users:
 *   post:
 *     tags:
 *          - users
 *     summary: Register user
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - first_name
 *              - last_name
 *              - email
 *              - password
 *            properties:
 *              first_name:
 *                type: string
 *                default: John
 *              last_name:
 *                type: string
 *                default: Doe
 *              email:
 *                type: string
 *                default: test@email.com
 *              password:
 *                type: string
 *                default: password123
 *     responses:
 *      201:
 *        description: Registered
 *      400:
 *        description: User exists
 *      500:
 *        description: Error
 */
router.post('/', controller.register)

/**
 * @swagger
 * /users/login:
 *   post:
 *     tags:
 *          - users
 *     summary: Login user
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - email
 *              - password
 *            properties:
 *              email:
 *                type: string
 *                default: test@email.com
 *              password:
 *                type: string
 *                default: password123
 *     responses:
 *      201:
 *        description: Logged in
 *      400:
 *        description: Bad syntacs
 *      500:
 *        description: Error
 */
router.post('/login', controller.login)

/**
 * @swagger
 * /users/{id}:
 *  get:
 *    tags:
 *          - users
 *    summary: Get user by id
 *    description: Get method to show all users
 *    parameters:
 *      - name: id
 *        in: path
 *        description: ID of a user in database
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
 * /users/{id}/update:
 *   post:
 *     tags:
 *          - users
 *     summary: Update user
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *      - name: id
 *        in: path
 *        description: ID of a user in database
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
 *              - first_name
 *              - last_name
 *              - email
 *              - password
 *            properties:
 *              first_name:
 *                type: string
 *                default: John
 *              last_name:
 *                type: string
 *                default: Doe
 *              email:
 *                type: string
 *                default: test@email.com
 *              password:
 *                type: string
 *                default: password123
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
 * /users/{id}:
 *  delete:
 *    tags:
 *          - users
 *    summary: Delete user by id
 *    description: Delete method to delete user by id
 *    security:
 *          - bearerAuth: []
 *    parameters:
 *      - name: id
 *        in: path
 *        description: ID of a user in database
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

router.post("/:id/follow", controller.followFriend);

router.post("/:id/unfollow", controller.unfollowFriend);

router.post('/:id/add-friend', controller.addFriend);

router.delete('/friend/:id', controller.deleteFriend)

module.exports = router;

