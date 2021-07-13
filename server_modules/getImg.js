/**
 * @param {Promise} page 브라우저
 * @return {Array} 검색 데이터
 */
async function getImg(page) {
  // 상단 탭 로딩 대기
  await page.waitForSelector(".MUFPAc", { timeout: 10000 });

  // 브라우저를 호출해 이미지 버튼을 클릭
  await page.evaluate(() => {
    const tab = document.querySelector(".MUFPAc").children;
    let imgBtn = null;

    for (let i = 0; i < tab.length; i++) {
      if (tab[i].textContent === "이미지") {
        imgBtn = tab[i].querySelector("a");
      }
    }
    imgBtn && imgBtn.click();
  });

  // 내용 대기
  await page.waitForSelector("#islrg .isv-r", { timeout: 10000 });

  await autoScroll(page);

  async function autoScroll(page) {
    await page.evaluate(async () => {
      await new Promise((resolve, reject) => {
        console.log(document.querySelector(".MUFPAc"));

        let totalHeight = 0;
        let distance = 250;
        const timer = setInterval(() => {
          let scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;

          if (totalHeight >= scrollHeight) {
            clearInterval(timer);
            resolve();
          }
        }, 150);
      });
    });
  }

  const imgUrlList = await page.evaluate(() => {
    const contents = Array.from(document.querySelectorAll("#islrg .isv-r"));
    let contentsList = [];
    contents.forEach((item) => {
      contentsList.push(item.querySelector("img").src);
      console.log(item.querySelector("img").src);
    });
    return contentsList;
  });

  return imgUrlList;
}

module.exports = getImg;
