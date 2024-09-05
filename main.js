

// import puppeteer from "puppeteer";
// import { query } from "./db.js";

// // Function to store data in a JSON file
// const storeData = async (value, closed_at) => {
//   try {
//     await query("INSERT  INTO flyaways (value, closed_at) VALUES ($1, $2)", [value, closed_at]);
//   } catch (err) {
//     console.error(err);
//   }
// };

// let browser;

// const runScript = async () => {
//   try {
//     // Close existing browser if it exists
//     if (browser) {
//       await browser.close();
//     }

//     // Launch the browser
//     browser = await puppeteer.launch({ headless: false });
//     const page = await browser.newPage();

//     // Extend navigation timeout
//     page.setDefaultNavigationTimeout(60000); // 60 seconds
//     page.setDefaultTimeout(60000); // 60 seconds

//     // Navigate to the Betika Aviator page
//     await page.goto("https://www.betika.com/en-ke/aviator");

//     // Wait for the button to appear and click it
//     await page.waitForSelector(
//       ".button.account__payments__submit.button.button__secondary.purple"
//     );
//     await page.evaluate(() => {
//       document
//         .querySelector(
//           ".button.account__payments__submit.button.button__secondary.purple"
//         )
//         .click();
//     });

//     // Wait for the iframe to load and get its frame
//     await page.waitForSelector("#aviator-iframe", { timeout: 60000 });
//     const frameHandle = await page.$("#aviator-iframe");
//     const frame = await frameHandle.contentFrame();

//     // Locate the section within the iframe using the provided selector
//     const selector =
//       "body > app-root > app-game > div > div.main-container > div.w-100.h-100 > div > div.game-play > div.result-history.disabled-on-game-focused.my-2 > app-stats-widget > div > div.payouts-wrapper > div";

//     // Previous length of the array
//     let previousLength = 0;

//     // Array to store the results
//     // const results = [];

//     while (true) {
//       // Check for disconnection
//       const isDisconnected = await page.evaluate(() => {
//         return document.querySelector(".text.ng-star-inserted") !== null;
//       });
//       if (isDisconnected) {
//         console.log("Disconnected. Rerunning script...");
//         return runScript();
//       }

//       // Wait for the payouts array to load
//       await frame.waitForSelector(selector, { timeout: 60000 });

//       // Extract the children nodes and get the array of values
//       const payouts = await frame.evaluate((selector) => {
//         const payoutsBlock = document.querySelector(selector);
//         return Array.from(payoutsBlock.children).map((child) => child.innerText);
//       }, selector);

//       // Check if the length of the array has changed
//       if (payouts.length !== previousLength) {
//         previousLength = payouts.length;

//         // Get the first element in the array and the current timestamp
//         const value = parseFloat(payouts[0].replace("x", ""));
//         const time = new Date();

//         // Write the results to database
//         storeData(value, time);

//         console.log(`Stored value: ${value} at time: ${time}`);
//       }

//       // Wait for a short interval before checking again (e.g., 1 second)
//       await new Promise((resolve) => setTimeout(resolve, 1000));
//     }
//   } catch (err) {
//     console.error(err);
//     if (browser) {
//       await browser.close();
//     }
//     return runScript();
//   }
// };

// runScript();

import puppeteer from "puppeteer";
import { query } from "./db.js";

// Function to store data in a JSON file
const storeData = async (value, closed_at) => {
  try {
    await query("INSERT  INTO flyaways (value, closed_at) VALUES ($1, $2)", [value, closed_at]);
  } catch (err) {
    console.error(err);
  }
};

let browser;
let previousValue;

const runScript = async () => {
  try {
    // Close existing browser if it exists
    if (browser) {
      await browser.close();
    }

    // Launch the browser
    browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    // Extend navigation timeout
    page.setDefaultNavigationTimeout(60000); // 60 seconds
    page.setDefaultTimeout(60000); // 60 seconds

    // Navigate to the Betika Aviator page
    await page.goto("https://www.betika.com/en-ke/aviator");

    // Wait for the button to appear and click it
    await page.waitForSelector(
      ".button.account__payments__submit.button.button__secondary.purple"
    );
    await page.evaluate(() => {
      document
        .querySelector(
          ".button.account__payments__submit.button.button__secondary.purple"
        )
        .click();
    });

    // Wait for the iframe to load and get its frame
    await page.waitForSelector("#aviator-iframe", { timeout: 60000 });
    const frameHandle = await page.$("#aviator-iframe");
    const frame = await frameHandle.contentFrame();

    // Locate the section within the iframe using the provided selector
    const selector =
      "body > app-root > app-game > div > div.main-container > div.w-100.h-100 > div > div.game-play > div.result-history.disabled-on-game-focused.my-2 > app-stats-widget > div > div.payouts-wrapper > div";

    while (true) {
      // Check for disconnection
      const isDisconnected = await page.evaluate(() => {
        return document.querySelector(".text.ng-star-inserted") !== null;
      });
      if (isDisconnected) {
        console.log("Disconnected. Rerunning script...");
        return runScript();
      }

      // Wait for the payouts array to load
      await frame.waitForSelector(selector, { timeout: 60000 });

      // Extract the first value
      const payouts = await frame.evaluate((selector) => {
        const payoutsBlock = document.querySelector(selector);
        return payoutsBlock.children[0].innerText;
      }, selector);

      const currentValue = parseFloat(payouts.replace("x", ""));
      if (previousValue !== currentValue) {
        previousValue = currentValue;

        // Get the current timestamp
        const time = new Date();

        // Write the results to database
        storeData(currentValue, time);

        console.log(`Stored value: ${currentValue} at time: ${time}`);
      }

      // Wait for a short interval before checking again (e.g., 1 second)
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  } catch (err) {
    console.error(err);
    if (browser) {
      await browser.close();
    }
    return runScript();
  }
};

runScript();