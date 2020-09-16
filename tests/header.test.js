//const puppeteer = require('puppeteer');
// const sessionFactory = require('./factories/sessionFactory');
// const userFactory = require('./factories/userFactory');
const Page = require('./helpers/page');

// test('Adds two numbers', () => {
//     const sum = 1+2;

//     expect(sum).toEqual(3);
// })

// test('We can launch a browser', async () => {
//     const browser = await puppeteer.launch({
//         headless: false
//     });//represents running browser
//     const page = await browser.newPage();//create new page using the above browser
//     //we can use it to click element and navigate to new browser and more
// });

// test('We can launch a browser', async () => {
//     const browser = await puppeteer.launch({
//         headless: false
//     });
//     const page = await browser.newPage();
// });

// test('We can launch a browser', async () => {
//     const browser = await puppeteer.launch({
//         headless: false
//     });
//     const page = await browser.newPage();
//     await page.goto('localhost:3000');

//     const text = await page.$eval('a.brand-logo', el => el.innerHTML);

//     expect(text).toEqual('Blogster');
// });

//run before each test

//let browser, page;

// beforeEach(async () => {
//      browser = await puppeteer.launch({
//         headless: false
//     });
//      page = await browser.newPage();
//     await page.goto('localhost:3000');
// });

// afterEach(async () => {
//     await browser.close();
// })

let page ;

beforeEach(async () => {

    page = await Page.build();
  // await page.goto('localhost:3000');
  await page.goto('http://localhost:3000');//because of travis
});

afterEach(async () => {
    await page.close();
})

test('The header has the correct text', async () => {
    //const text = await page.$eval('a.brand-logo', el => el.innerHTML);
    const text = await page.getContentsOf('a.brand-logo');
    
    expect(text).toEqual('Blogster');
});

test('Cliking login starts oauth flow', async () => {
    await page.click('.right a')

    const url = await page.url();

    //console.log(url);

    expect(url).toMatch(/accounts\.google\.com/);
})
//test.only will run only that test and skips all the other tests
// test('When signed in, shows logout button', async () => {
//     const id = '5f5447816eef36113c403b0c';

//     const Buffer = require('safe-buffer').Buffer;
//     const sessionObject= {
//    passport: {
//        user: id
//    }
//     };
//     const sessionString = Buffer.from(JSON.stringify(sessionObject)).toString('base64');// here 

//     const Keygrip = require('keygrip');
//     const keys = require('../config/keys');
//     const keygrip = new Keygrip([keys.cookieKey]);
//     //session equals plus session string just because
//     //that is internally how the cookie's library does this.
//     const sig = keygrip.sign('session=' + sessionString); 
//  //console.log(sessionString, sig);

//  await page.setCookie({ name: 'session', value: sessionString });
//  await page.setCookie({ name: 'session.sig', value: sig});
//  await page.goto('localhost:3000');
//  await page.waitFor('a[href="/auth/logout"]');// this will wait untill the page display the logout element and run the chromium instance

//  const text = await page.$eval('a[href="/auth/logout"]', el => el.innerHTML);

//  expect(text).toEqual('Logout');
// });



// test('When signed in, shows logout button', async () => {
// const user = await userFactory();    
// const { session, sig } = sessionFactory(user);

//  await page.setCookie({ name: 'session', value: session });
//  await page.setCookie({ name: 'session.sig', value: sig});
//  await page.goto('localhost:3000');
//  await page.waitFor('a[href="/auth/logout"]');// this will wait untill the page display the logout element and run the chromium instance

//  const text = await page.$eval('a[href="/auth/logout"]', el => el.innerHTML);

//  expect(text).toEqual('Logout');
// });

test('When signed in, shows logout button', async () => {
await page.login();
    
     //const text = await page.$eval('a[href="/auth/logout"]', el => el.innerHTML);
       const text = await page.getContentsOf('a[href="/auth/logout"]'); 

     expect(text).toEqual('Logout');
    });

