// EDIT THIS FILE TO COMPLETE ASSIGNMENT QUESTION 1
const axios = require('axios').def
const { chromium } = require("playwright");
const fs = require("fs");

async function saveHackerNewsArticles() {
  // launch browser
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // go to Hacker News
  await page.goto("https://news.ycombinator.com");

  await page.waitForSelector("#hnmain");
  
  // Const to call top 10 articles from page defined in row 12
  const topArticles = await page.$$eval('.titleline', (rows) => {
    // defined array which will be returned at end of function
    const articles = [];
    // for loop to evaluate the page and extract URL and titles of articles 1-10
    for (let i = 0; i < 10; i++) {
      const row = rows[i];
      const titleElement = row.querySelector(".titleline a");
      const url = titleElement.href;
      const title = titleElement.innerText.trim();
      // section to call on eden AI to summarise article
      
      fetch(url)
        .then(response => {
          if (!responce.ok){
            throw new Error('Network responce was not ok'):
          }
          return responce.text
        })
        .then(body =>{
          url_body = body;
        });

        const options = {
          method: "POST",
          url: "https://api.edenai.run/v2/text/summarize",
          headers: {
            authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNzRmZTdkYzItNzQ4Mi00ZWU0LWI4MDUtZDhiNGY2M2FiOTM3IiwidHlwZSI6ImFwaV90b2tlbiJ9.fCQnifCGu9vUB9cVZiuuosdbLh3voeh9InKW4PCsu60",
          },
          data: {
            output_sentences: 1,
            providers: "openai",
            text: url_body,
            language: "en",
            fallback_providers: "",
          },
        };
 
    axios
      .request(options)
      .then((response) => {
        summary = response.data; 
      })
    
                          
      // push extracted title and url to array
      articles.push({title, url, summary});
    }
    return articles;  
  });

  // save data to CSV file
  const csvData = topArticles.map(article => `${article.title}, ${article.url}`).join("\n");
  fs.writeFileSync("Hacker_news_Top_10_TEST.csv", csvData);

  //Add message confirming outcome
  console.log("Top 10 articles have been saved to Hacker_news_Top_10_TEST.csv");

  //closing Browser
  await browser.close();
}

(async () => {
  await saveHackerNewsArticles();
})();
