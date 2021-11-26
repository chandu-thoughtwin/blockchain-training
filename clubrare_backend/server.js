// BASE SETUP
const express = require('express');
const app = express();
//const router = express.Router();
const apiRoutes = express.Router(); 
const port = process.env.PORT || 8000;

// Middlewares 
const http = require('http');
const bodyParser = require('body-parser');
const secure = require('./config/secure.js');
var multer 				= require('multer');
const morgan = require('morgan');
const expFileUpload = require("express-fileupload");
app.use(expFileUpload());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));




// Routes
const database = require('./config/database');
const jwt = require('jsonwebtoken');
const genRes = require('./api/controllers/genres.js');
const cors = require('cors');

 
// Routes 
const apiUsersRouteController = require('./api/routecontrollers/users.js');
const apiCollectibleRouteController = require('./api/routecontrollers/collectibles.js');
const apiNotificationRouteController = require('./api/routecontrollers/notifications.js');
const apiReportRouteController = require('./api/routecontrollers/reports.js');
const apiCollectionRouteController = require('./api/routecontrollers/collections.js');
const apiRedeemOrderRouteController = require('./api/routecontrollers/redeem_orders.js');

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(cors());
app.options('*', cors());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});
const upload = multer({ dest: 'uploads/' });
app.use(morgan('dev'));								// log every request to the console
//app.use(cookieParser());							// parse cookies

app.use('/api', apiRoutes);

// apies for users
app.get('/api/v1.1/users/get', apiUsersRouteController.getAll);
app.get('/api/v1.1/users/top/buyers/get', apiUsersRouteController.getTopBuyers);
app.get('/api/v1.1/users/top/sellers/get', apiUsersRouteController.getTopSellers);
app.get('/api/v1.1/users/live/auctions/get', apiUsersRouteController.getLiveAuctions);
app.get('/api/v1.1/users/my/items/get', apiUsersRouteController.getMyItemsList);
app.get('/api/v1.1/users/all/items/get', apiUsersRouteController.getAllItemsList);
app.get('/api/v1.1/users/single/profile/get', apiUsersRouteController.getUserBasedOnWallet);
app.get('/api/v1.1/users/cover/image/get', apiUsersRouteController.getCoverImage);
app.post('/api/v1.1/users/create', apiUsersRouteController.createUser);
app.post('/api/v1.1/users/update', apiUsersRouteController.updateUser);
app.post('/api/v1.1/users/update/cover/image', apiUsersRouteController.updateCoverImage);
app.post('/api/v1.1/users/block', apiUsersRouteController.blockUser);
app.get('/api/v1.1/users/my/items/on/sale/get', apiUsersRouteController.getMyItemsOnSale);
app.get('/api/v1.1/users/my/items/creator/list/get', apiUsersRouteController.getMyItemsCreatedList);

// get Explore List
app.get('/api/v1.1/explore/list/get', apiUsersRouteController.getExploreList);

// apies for collectibles
app.post('/api/v1.1/collectible/create', apiCollectibleRouteController.createCollectible);
app.get('/api/v1.1/collectible/nft/single/page/get', apiCollectibleRouteController.getNFTSinglePage);
app.post('/api/v1.1/collectible/approve', apiCollectibleRouteController.approveCollectible);
app.post('/api/v1.1/collectible/update', apiCollectibleRouteController.updateCollectible);

// apies for notification
app.post('/api/v1.1/notifications/firebase/send', apiNotificationRouteController.pushNotificationByFirebase);
app.get('/api/v1.1/notifications/get', apiNotificationRouteController.getNotification);
app.post('/api/v1.1/notifications/create', apiNotificationRouteController.create);

// apies for report
app.post('/api/v1.1/report/create', apiReportRouteController.create);
app.get('/api/v1.1/report/get', apiReportRouteController.getWithUserInfo);

// apies for collection
app.post('/api/v1.1/collection/create', apiCollectionRouteController.create);
app.get('/api/v1.1/collection/get', apiCollectionRouteController.get);


// apies for redeem order
app.post('/api/v1.1/redeem/order/create', apiRedeemOrderRouteController.create);
app.get('/api/v1.1/redeem/order/get', apiRedeemOrderRouteController.get);
app.post('/api/v1.1/redeem/order/status/update', apiRedeemOrderRouteController.updateStatus);
app.get('/api/v1.1/redeem/list/get', apiCollectibleRouteController.getRedeemList);
app.post('/api/v1.1/redeem/order/burn/update', apiRedeemOrderRouteController.updateBurn);

//connect mongodb
var mongoose = require('mongoose');
const db = require('./config/database').url
mongoose.connect(db, {
    useNewUrlParser: true
}).then(() => {
    console.log("Successfully connected to the database");
}).catch(err => {
    console.log('Could not connect to the database.', err);
    process.exit();
});


//port
app.listen(port);