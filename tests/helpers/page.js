const puppeteer = require('puppeteer');
const sessionFactory = require('../factories/sessionFactory');
const userFactory = require('../factories/userFactory');

class CustomPage {
    static async build(){
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox']
        });

        const page = await browser.newPage();
        const customPage = new CustomPage(page);

        return new Proxy(customPage, {
            get: function(target, property){
                return customPage[property] || browser[property] || page[property] ;
            }
        });
    }

    constructor(page){
        this.page = page;
    }

    async login(){
        const user = await userFactory();    
        const { session, sig } = sessionFactory(user);
        
         await this.page.setCookie({ name: 'session', value: session });
         await this.page.setCookie({ name: 'session.sig', value: sig});
         //await this.page.goto('localhost:3000');
        //  await this.page.goto('localhost:3000/blogs');
        await this.page.goto('http://localhost:3000/blogs');//because of travis
         await this.page.waitFor('a[href="/auth/logout"]');
    }

    async getContentsOf(selector){
        return this.page.$eval(selector, el => el.innerHTML);
    }
}

module.exports = CustomPage;

//The close function of browser wont work because there is two close function inside the proxy that is page has a close function and also browser has a close function also
//So it gets confused and done the page[property] not the browser[property]
//because page is aligned second in the or operator function
//customPage[property] || page[property] || browser[property];
//swap the order it will work
//customPage[property] || browser[property] || page[property]