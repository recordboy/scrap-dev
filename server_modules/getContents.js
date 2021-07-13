/**
 * @param {Promise} page 브라우저
 * @return {Array} 검색 데이터
 */
async function getContents(page) {
  // 모든 검색결과
  let searchAllData = [];

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
          const text = item.querySelector(".VwiC3b");
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

  return searchAllData;
}

module.exports = getContents;
