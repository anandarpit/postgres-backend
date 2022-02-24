const router = require(`express`).Router();

const {isLoggedIn} = require("./middleware/auth.middleware")

const cc = require('./controller/create.controller')
const ac = require('./controller/auth.controller')
const pc = require('./controller/profile.controller')
const pc2 = require('./controller/post.controller')

router.post('/api/createuser', cc.CreateUser);
router.post('/api/authenticate', ac.AuthenticateUser);
router.post('/api/follow',isLoggedIn, pc.FollowUser);
router.post('/api/unfollow',isLoggedIn, pc.UnfollowUser);
router.get('/api/user', isLoggedIn, pc.GetUser);
router.post('/api/posts', isLoggedIn, pc2.CreatePost);

module.exports = router;