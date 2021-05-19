// express 모듈 불러오기
const express = require("express");

// express 객체 생성
const app = express();

// 기본 포트를 app 객체에 설정
const port = process.env.PORT || 5000;
app.listen(port);

let resultList;

// 키워드 요청
app.use("/api/data", async function (req, res, next) {
  console.log("검색 키워드: " + req.query.keyword);
  console.log("검색 페이지: " + req.query.pageNum);
  resultList = await openBrowser(req.query.keyword, req.query.pageNum);
  res.json(resultList);
});

app.get("/api/page", function (req, res, next) {
  res.json([{ a: "sada" }]);
});

console.log(`server running at http ${port}`);

// puppeteer 모듈 불러오기
const puppeteer = require("puppeteer");

/**
 * 브라우저 오픈 함수
 * @param {string} keyword 검색 키워드
 * @param {number} pageNum 검색 페이지
 * @return {array} 검색 결과
 */
async function openBrowser(keyword, pageNum) {

  // 모든 검색결과
  let searchAllData = [];

  // 브라우저 실행 및 옵션, 현재 옵션은 headless 모드 사용 여부
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--window-size=1600,2000",
    ],
  });

  // 브라우저 열기
  const page = await browser.newPage();

  // 해당 리소스 로딩 안함 
  await page.setRequestInterception(true);
  await page.on("request", (req) => {

    // console.log(req.resourceType());
    if (
      req.resourceType() == "stylesheet" ||
      req.resourceType() == "font" ||
      req.resourceType() == "image"
    ) {
      req.abort();
    } else {
      req.continue();
    }
  });
  await page.setJavaScriptEnabled(false);

  // 포탈로 이동
  await page.goto("https://www.google.com/");

  // 키워드 입력
  await page.type("input[class='gLFyf gsfi']", keyword);

  // 키워드 검색
  await page.type("input[class='gLFyf gsfi']", String.fromCharCode(13));

  // 검색하고 싶은 페이지 수 만큼 반복
  for (let i = 0; i < 20; i++) {
    console.log(i + " ..");

    // 처음 검색
    if (i === 0) {
      // 예외 처리
      try {
        // 해당 콘텐츠가 로드될 때까지 대기
        await page.waitForSelector("#rso div.g", { timeout: 10000 });

        // 크롤링해서 검색 결과들을 담음
        searchAllData.push(...(await crawlingData()));
      } catch (error) {
        // 해당 태그가 없을 시 검색결과 없음 반환
        console.log("에러 발생: " + error);
        return [
          {
            title: "검색결과 없음",
            link: "",
            text: "",
            kategorie: "",
          },
        ];
      }

      // 처음 이후 검색
    } else {
      // 예외 처리
      try {
        // 다음 버튼이 로드될때까지 대기
        await page.waitForSelector("#pnnext", { timeout: 10000 });

        // 브라우저를 호출해 다음 버튼을 클릭
        await page.evaluate(() => {
          const nextBtn = document.querySelector("#pnnext");
          nextBtn && nextBtn.click();
        });

        // 크롤링해서 검색 결과들을 담음
        searchAllData.push(...(await crawlingData()));

        // 다음 버튼이 더이상 없는 경우 지금까지 크롤링한 모든 검색결과 반환
      } catch (error) {
        return searchAllData;
      }
    }
  }

  /**
   * 크롤링 함수
   * @return {array} 검색 결과
   */
  async function crawlingData() {
    // 해당 콘텐츠가 로드될 때까지 대기
    await page.waitForSelector("#rso div.g", { timeout: 10000 });

    // 호출된 브라우저 영역
    const searchData = await page.evaluate(() => {
      // 검색된 돔 요소를 배열에 담음
      const contentsList = Array.from(document.querySelectorAll("#rso div.g"));
      let contentsObjList = [];

      // 검색결과 크롤링
      contentsList.forEach((item) => {
        if (item.className === "g") {
          const title = item.querySelector("h3");
          const link = item.querySelector(".yuRUbf");
          const text = item.querySelector(".aCOpRe");
          const kategorie = item.querySelector(".iUh30 ");

          if (title && link && text && kategorie) {
            contentsObjList.push({
              title: title.textContent, // 타이틀
              link: link.children[0].href, // 링크
              text: text.textContent, // 내용
              kategorie: kategorie.textContent, // 카테고리
            });
          }
        }
      });

      // 호출된 브라우저 영역 콘솔창에서 확인할 수 있음
      console.log(contentsList); // 검색한 엘리먼트 리스트
      console.log(contentsObjList); // 검색한 콘텐츠 오브젝트 리스트

      return contentsObjList;
    });

    // 검색결과 반환
    return searchData;
  }

  // 브라우저 닫기
  browser.close();

  // 모든 검색결과 반환
  return searchAllData;
}

// path 모듈 불러오기
const path = require("path");

// 리액트 정적 파일 제공
app.use(express.static(path.join(__dirname, "client/build")));

// 라우트 설정
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});
