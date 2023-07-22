const puppeteer = require('puppeteer');
let scrape = async (userid) => {
  const browser = await puppeteer.launch({
    headless: 'new',
  });
  const page = await browser.newPage();

  await page.goto(
    'https://www.duolingo.com/2017-06-30/users?username=' +
    userid +
    '&fields=users%7Bcourses,creationDate,currentCourse,currentCourseId,gemsConfig,globalAmbassadorStatus,hasPlus,id,lingots,name,picture,privacySettings,roles,streak,streakData%7BcurrentStreak,previousStreak%7D,totalXp,username%7D&_=1688400563982',
    { timeout: 0 },
  );

  const result = await page.evaluate(() => {
    // let stock = document.querySelector('*').outerHTML;
    let stock = document.querySelector('html').innerText;

    return {
      stock,
    };
  });

  browser.close();
  return result;
};

const check = () => {
  scrape().then((value) => {
    try {
      let data = JSON.parse(value.stock);
      console.log(data)
      let online =
        data.users[0].streakData.currentStreak.endDate;

      let today = new Date().toISOString().split('T')[0];
      return online === today;
    } catch (e) {
      return false;
    }
  });
}

module.exports = scrape
