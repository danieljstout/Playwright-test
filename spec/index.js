const { webkit } = require('playwright');
const { expect } = require("chai");
const internet = require('../pages/page.js');

let page;
let browser;
describe("the internet", () => {
    before(async function fn() {
        this.timeout(20000);
        browser = await webkit.launch({ headless: false, slowMo: 50 });
    
        const context = await browser.newContext();
        page = await browser.newPage();
    
        await page
          .goto(internet.url(), {
            // networkidle0 comes handy for SPAs that load resources with fetch requests.
            // networkidle2 comes handy for pages that do long-polling or any other side activity.
            waitUntil: "networkidle0",
          })
          .catch(() => {});
      });

      after(() => {
        if (!page.isClosed()) {
          browser.close();
        }
      });
    it("should reach the internet test page", async () => {
        await page.click(internet.links.wysiwygEditor);
        const title = await page.$eval("h3", (el) => el.textContent);
        expect(title).to.equal('An iFrame containing the TinyMCE WYSIWYG Editor');
        expect((await page.title()).toLowerCase()).to.equal("the internet");
    });
});