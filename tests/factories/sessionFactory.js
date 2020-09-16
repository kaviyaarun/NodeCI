const Buffer = require('safe-buffer').Buffer;
const Keygrip = require('keygrip');
const keys = require('../../config/keys');
const keygrip = new Keygrip([keys.cookieKey]);

                //|-> it is going to be a referance of mongoose model
module.exports = user => {
    const sessionObject= {
   passport: {
       user: user._id.toString()
   }
    };
    const session = Buffer.from(JSON.stringify(sessionObject)).toString('base64');
    const sig = keygrip.sign('session=' + session); 

    return { session, sig };// it may not be an object you can use array also

};