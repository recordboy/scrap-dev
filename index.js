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
  // 브라우저 실행 및 옵션, 현재 옵션은 headless 모드 사용 여부
  const browser = await puppeteer.launch({
    headless: false,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--window-size=1600,2000",
    ],
  });

  // 브라우저 열기
  const page = await browser.newPage();

  // 해당 리소스 로딩 안함
  // await page.setRequestInterception(true);
  // await page.on("request", (req) => {

  //   // console.log(req.resourceType());
  //   if (
  //     req.resourceType() == "stylesheet" ||
  //     req.resourceType() == "font" ||
  //     req.resourceType() == "image"
  //   ) {
  //     req.abort();
  //   } else {
  //     req.continue();
  //   }
  // });
  // await page.setJavaScriptEnabled(false);

  // 포탈로 이동
  await page.goto("https://www.google.com/");

  // 키워드 입력
  await page.type("input[class='gLFyf gsfi']", keyword);

  // 키워드 검색
  await page.type("input[class='gLFyf gsfi']", String.fromCharCode(13));

  // 이미지 영역

  // 크롤러 모듈
  const getImg = require("./server_modules/getImg");

  return getImg(page);

  // const getContents = require("./server_modules/getContents");
  // return getContents(page);

  // 브라우저 닫기
  // browser.close();
}

// path 모듈 불러오기
const path = require("path");

// 리액트 정적 파일 제공
app.use(express.static(path.join(__dirname, "client/build")));

// 라우트 설정
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});
