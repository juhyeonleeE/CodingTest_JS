/* 
전체적인 설명
'columnHints'값으로 각 column별 가중치를 만든 후, column별 가중치에 따른 greedy기법을 적용(큰 가중치 우선선택)하여 각 row당 cookie를 배치한다
배치한 cookie가 문제 조건에 부합한지 확인 후, 부합하면 그 다음 row를 탐색하여 같은 방식을 반복하고, 부합하지 못하면 같은 row를 재탐색한다 
만약 해당 row에 대해 모두 탐색한 결과가 문제 조건에 부합한지 못하면 backtracking하여 이전 row들 부터 재탐색한다. 
모든 row의 조건을 만족하면 정답을 return한다

각 함수별 설명
1. makeColWeight - columm별 가중치를 json형식으로 저장하는 함수 
                        (가중치 = columm별 cookie수 + cookie간 최소 간격 or 예외처리(선택불가/선택필수)를 나타내는 값)
2. compareNumSort - json의 value값으로 내림차순 정렬하는 함수 (makeColWeight의 json값을 정렬함)
3. saveNumOfCookie - row별 cookie에 관한 정보를 json형식으로 생성 및 초기화하는 함수 
                        (row별 필요한 총 cookie수, GreedySetInCookie함수 실행횟수, row별 columnHints값 정보)
4. GreedySetInCookie - 탐욕적 기법에 따른 (row별)cookie 배치를 실행하는 함수
5. checkingRowCondition- 배치된 cookie가 (row별)조건에 부합한지 확인하는 함수
6. changeColumnHints - 현재까지 배치된 cookie에 따라 columnHints값을 변경하는 합수

흐름도
saveNumOfCookie -> makeColWeight -> compareNumSort -> GreedySetInCookie -> (checkingRowCondition) -> (changeColumnHints)
(makeColWeight -> ... -> changeColumnHints : 반복 구간)
*/


// solve.js
export function solve(width, height, columnHints, rowHints) {

  const answer = []


  // 1. 입력받은 각 row별 columnHints값을 이용해 columm별 가중치를 json형식으로 표현
  const makeColWeight = (newColumnHints) => {
    const newColumSortList = []
    
    for(let i=0; i < newColumnHints.length; i++){
      let columJson = {}    // {colIndex: columm 번호, colWeight: columm별 가중치} 형식 
      columJson['colIndex'] = i
      columJson['colWeight'] = 0

      for(let j=0; j < newColumnHints[i].length; j++){
        
        if(newColumnHints[i][0] === -1) {    // 해당 column이 선택불가인 경우, 이후 리스트 값을 가중치에 반영할 필요가 없으므로 break
          columJson['colWeight'] = 0    // 가중치 = 0(선택불가)
          break
        }
        else if(newColumnHints[i][0] === -2) {    // 해당 column이 선택필수인 경우, 이후 리스트 값을 가중치에 반영할 필요가 없으므로 break
          columJson['colWeight'] = Number.MAX_SAFE_INTEGER    // 가중치 = max(선택필수)
          break
        }

        else if(j === 0){                   // 리스트 맨 처음 값일 경우
          columJson['colWeight'] = newColumnHints[i].length - 1    // 가중치 = 연속되지 않은 cookie간 최소 간격
        }
        columJson['colWeight'] = columJson['colWeight'] + newColumnHints[i][j]    // 가중치 = columm별 cookie수 + 연속되지 않은 cookie간 최소 간격
      }

      if(columJson['colWeight'] !== 0) {    // column이 선택불가인 경우를 제외하고 가중치 json을 리스트에 저장
        newColumSortList.push(columJson)
      }
    }

    return newColumSortList
  }


  // 2. 'colWeight'key에 대한 내림차순 정렬 수행
  function compareNumSort(a, b) {
    return b['colWeight'] - a['colWeight'];
  }


  // 3. row별 필요한 정보를 json형식으로 생성 및 초기화
  const saveNumOfCookie = () => {
    const initRowInfoList = []

    for(let i=0; i < rowHints.length; i++){
      let rowInfoJson = {}    // {rowSum: row별 총 cookie 수, attempNum: row별 Greedy 탐색횟수, columnHints: row별 columnHints} 형식
                              // row별 columnHints - 현재 row까지 배치된 cookie에 따른 columnHints
      rowInfoJson['rowSum'] = 0
      rowInfoJson['attempNum'] = 0
      rowInfoJson['columnHints'] = []
  
      for(let j=0; j < rowHints[i].length; j++){    // rowHints내 리스트 총합 = row별 총 cookie 수
        rowInfoJson['rowSum'] = rowInfoJson['rowSum'] + rowHints[i][j]
      }
  
      initRowInfoList.push(rowInfoJson)
    }

    return initRowInfoList
  }

  
  /* 4. RowInfoList와 ColumSortList를 이용한 greedy 기법에 따라 row별 cookie 배치
        n(해당 row greedy탐색 횟수)번째로 큰 'column가중치' 조합을 선택 -> 조합에 해당하는 'column가중치' 값을 가진 column index를 저장 */
  // RowInfoList - saveNumOfCookie함수에서 만든 객체
  // ColumSortList - makeColWeight함수에서 만든 객체 + 내림차순 sort, (row별 cookie를 배치할 수 있는 column index가 존재)
  const GreedySetInCookie = (newRowInfoList, newColumSortList) => {
    const cookieByRowList = []

    if(newColumSortList.length < newRowInfoList['rowSum']) {    // row별 불필요한 greedy 탐색일 시 backTracking을 의미하는 list를 return
                                                                // (row별 cookie를 배치할 수 있는 column수 < row별 필요한 cookie수)
      return [-1]
    }

    let maxBinaNum = ''
    for(let i = 0; i < newColumSortList.length; i++) {    /* 가중치가 최대가 되도록 ColumSortList(위 주석 참조)의 '0'번째부터 index를 선택하고 
                                                             이진값으로 표현(1은 선택, 0은 비선택 의미) + row별 필요 cookie수 만큼 index선택 */ 
                                                             //예: 111000 (row별 필요 cookie수 - '3', 선택된 index - '0, 1, 2')
      if(i < newRowInfoList['rowSum']) {    // row별 필요 cookie수 만큼 1로 배치
        maxBinaNum = maxBinaNum + '1'
      }
      else {
        maxBinaNum = maxBinaNum + '0'
      }
    }
    maxBinaNum = parseInt(maxBinaNum)

    let targetNum = parseInt(maxBinaNum, 2)
    let targetBinaNum = targetNum.toString(2)    // 이진수로 변환
    for(let i = newRowInfoList['attempNum']; i > 0; ) {    // row별 필요 cookie수(1갯수)를 만족하면서 row별 greedy탐색 횟수번째만큼 작은 값 추출
                                                            // 예: 111000 -> 110010 (row별 필요 cookie수 - '3', row별 greedy탐색 횟수 - '2')
      targetNum--
      if(targetNum < 0) {    // 조건을 만족하는 값을 찾지 못하면(음수 발생) backTracking을 의미하는 list를 return
        return [-1]
      }

      targetBinaNum = targetNum.toString(2)
      if(targetBinaNum.replace(/0/g, '').length === newRowInfoList['rowSum']) {    // row별 필요 cookie수(1갯수)를 만족하는 값을 찾으면 반복자 감소
        i--
      }

    }

    for(let i=0; i < width; i++) {    // row별 선택된 column 초기화
      cookieByRowList.push(0)
    }

    let continuZero = ''
    for(let i = newColumSortList.length; i > 0; i--) {
      if(targetBinaNum.length < i) {
        continuZero = '0' + continuZero
      }
      else {
        targetBinaNum = continuZero + targetBinaNum
        break
      }
    }

    for(let i=0; i < targetBinaNum.length; i++) {    // row별 선택된 column index를 '1'로 표현하여 list에 저장 
      if( targetBinaNum[i] === '1' ) {    // ColumSortList의 'i'번째가 선택되었으면
        let targetIndex = newColumSortList[i]['colIndex']    // ColumSortList의 'i'번째에 저장된 column index 추출
        cookieByRowList[targetIndex] = 1    // row별 선택된 column index를 '1'로 표현
      }
    }

    return cookieByRowList
  }


  // 5. row별 배치된 cookie를 rowHints형식으로 만들어 문제에서 주어진 rowHints조건에 부합한지 확인하는 함수
  const checkingRowCondition = (toBeComparedList, currentRow, currentColumnHints) => {
    let continuValue = 0
    const rowHintsFromList = []

    for(let i=0; i < toBeComparedList.length; i++){    // row별 배치된 cookie list를 rowHints형식으로 변환
      if( (toBeComparedList[i] === 0) && (currentColumnHints[i][0] === -2) ) {    // cookie 배치가 필수인 colum에 cookie가 없는 경우 false
        return false
      }

      if(toBeComparedList[i] === 0 && continuValue !== 0) {    // cookie배치 연속성이 끊어지면 continuValue(연속된 cookie수)를 저장
        rowHintsFromList.push(continuValue)
        continuValue = 0
      }
      else if(toBeComparedList[i] === 1) {
        continuValue++
        if( i === (toBeComparedList.length - 1) ) {    // 마지막 항목이면 저장
          rowHintsFromList.push(continuValue)
        }
      }
    }

    if(rowHintsFromList.length !== rowHints[currentRow].length) {
      return false
    }

    for(let i=0; i < rowHints[currentRow].length; i++){    // 만든 rowHints와 문제에서 주어진 rowHints의 항목 값이 다르면 false
      if(rowHintsFromList[i] !== rowHints[currentRow][i]) {
        return false
      }      
    }

    return true
  }

  
  // 6. 현재까지 배치된 cookie에 따라 row별 columnHints를 변경하는 합수
  const changeColumnHints = (currentRowList, currentColumnHints) => {
    const copyList = JSON.parse(JSON.stringify(currentColumnHints))

    for(let i=0; i < copyList.length; i++) {
      if(copyList[i][0] === -1 || copyList[i][0] === -2) {    // 상위 row의 cookie 배치 시 사용된 제약조건들 삭제
        copyList[i].splice(0, 1)
      }

      if(currentRowList[i] === 1) {    // cookie를 배치 시 해당 'columnHints'값 변경
        copyList[i][0]--

        if(copyList[i][0] === 0 && copyList[i].length > 1) {    // cookie 배치간격를 위해 '선택불가' 제약조건(-1) 입력
                                                                // (예: [1, 2]에서 선택되면 다음 row에서 선택불가)
          copyList[i][0] = -1
        }
        else if(copyList[i][0] === 0) {    // cookie 배치 후 값이 '0'이면 값 삭제, (예: [1]에서 선택되면 []로 처리)
          copyList[i].splice(0, 1)
        }
        else if(copyList[i][0] !== 0) {    // cookie 연속배치를 위해 '선택필수' 제약조건(-2) 입력
                                            // (예: [3]에서 선택되면 다음 row에서 선택필수)
          copyList[i].unshift(-2);
        }                                                
      }
    }


    return copyList

  }

  

  const byRowAnswerList = []
  let currentRow = 0
  let checkFlag

  const rowInfoList = saveNumOfCookie()
  rowInfoList[currentRow]['columnHints'] = columnHints

  while(true) {

    let columSortList = makeColWeight(rowInfoList[currentRow]['columnHints'])    // 해당 row의 'column 가중치'관련 객체
    columSortList.sort(compareNumSort)
    
    let cookieByRowList = GreedySetInCookie(rowInfoList[currentRow], columSortList)    // greedy기법을 적용한 해당 row의 'column 배치' list
    
    if(cookieByRowList[0] === -1) {    // backTracking 시 rowInfoList 초기화 (-1값이면 backTracking 의미)
      rowInfoList[currentRow]['attempNum'] = 0
      rowInfoList[currentRow]['columnHints'] = []

      currentRow--
      if(currentRow < 0) {    // backTracking 할 것이 없다면 이대로 종료
        return answer
      }

      rowInfoList[currentRow]['attempNum']++    // 해당 row의 greedy탐색 횟수 증가
    }
    else{

      checkFlag = checkingRowCondition(cookieByRowList, currentRow, rowInfoList[currentRow]['columnHints'])    // 해당 row의 'column 배치' list 적합성 판단

      if(checkFlag) {    // 적합하면 (문제조건에 맞으면)
        if( !byRowAnswerList[currentRow] ) {
          byRowAnswerList.push(cookieByRowList)    // 해당 row별 'column 배치' list 저장
        }
        else {
          byRowAnswerList[currentRow] = cookieByRowList    // 해당 row별 'column 배치' list 수정
        }

        if( currentRow === (height - 1) ) {    // 모든 row에 대해 문제조건이 성립하면 알고리즘 종료
          break
        }
        let newColumnHints = changeColumnHints(cookieByRowList, rowInfoList[currentRow]['columnHints'])    // 다음 row에 사용될 'columnHints' 객체
        currentRow++
        rowInfoList[currentRow]['columnHints'] = newColumnHints
      }
      else {
        rowInfoList[currentRow]['attempNum']++    // 해당 row의 greedy탐색 횟수 증가
      }

    }

  }

  for(let i=0; i < byRowAnswerList.length; i++) {    // 정답list 객체에 알고리즘으로 구한 정답을 입력 
    for(let j=0; j < byRowAnswerList[i].length; j++) {
      answer.push(byRowAnswerList[i][j])
    }
  }

  
  return answer

}


// exports.default = solve