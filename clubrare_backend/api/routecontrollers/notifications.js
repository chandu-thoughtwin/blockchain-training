const genRes = require('../controllers/genres.js');
const Notification = require('../controllers/notifications.js');
const constants = require("../../config/hintmembership-firebase-adminsdk-iybwr-750d355127.json");
const admin = require("firebase-admin");

// Initialize Firebase
admin.initializeApp({
  credential: admin.credential.cert(constants)
});


/** function for get notification based on wallet address */
exports.getNotification = async (req, res) => {
  try {
    const { wallet_address } = req.query;
    if (!wallet_address || wallet_address == 'null' || wallet_address == 'undefined') throw new Error("Wallet Address is Required");
    const notification = await Notification.get(wallet_address);

    if (notification == null || notification == undefined) throw new Error("Notification Not Found");

    const newNotificationArr = JSON.parse(JSON.stringify(notification.notifications));

    notification.notifications = notification.notifications.filter((item) => { return item.status === 'unread' });

    if(notification.notifications.length == 0) throw new Error("Notification Not Found");
   
    await newNotificationArr.forEach((item, index, array) => {
      array[index].status = 'read'
    });

    await Notification.updateNotification(wallet_address, newNotificationArr);

    return res.send(genRes.generateResponse(true, "Notification found successfully", 200, notification));
  } catch (error) {
    return res.send(genRes.generateResponse(false, error.message, 400, null));
  }
}

/** for temporary use only */
exports.create = async (req, res) => {
  const notification = req.body;
  try {
    await Notification.create(notification);
    return res.send(genRes.generateResponse(true, "Notification successfully create", 200, null));
  } catch (error) {
    return res.send(genRes.generateResponse(false, error.message, 400, null));
  }
}


/** method used for send/push notification by Device Token(input) */
exports.pushNotificationByFirebase = async (req, res) => {
  const { wallet_address, registrationToken } = req.body;
  if (!wallet_address) return res.send(genRes.generateResponse(false, "Wallet Address is Required", 400, null));
  if (!registrationToken) return res.send(genRes.generateResponse(false, "registrationToken is Required", 400, null));

  try {
    const message = {
      data: {
        score: '850',
        time: '2:45'
      },
      notification: {
        title: 'welcome',
        body: 'Welcome to new world of NFT'
      },
      token: registrationToken
    };
    const response = await admin.messaging().send(message); // response is a message ID string.
    return res.send(genRes.generateResponse(true, "Successfully sent message", 200, response));
  } catch (error) {
    return res.send(genRes.generateResponse(false, error.message, 400, null));
  }
}
