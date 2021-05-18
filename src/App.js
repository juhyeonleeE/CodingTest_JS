import './App.css';

import React from 'react';
import {solve} from './solve'

let width
let height
let columnHints
let rowHints

// width = 13
// height = 5
// columnHints = [[1], [1], [5], [], [1, 1], [], [1, 1, 1], [1, 1, 1], [5], [], [3, 1], [1, 1, 1], [1,3]]
// rowHints = [[3, 3, 3], [1, 1, 1, 1], [1, 3, 3], [1, 1, 1, 1], [1, 3, 3]]
// let answer = [
//   1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1,
//    0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0,
//    0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1,
//    0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1,
//    0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1
//   ] 

// width = 8
// height = 6
// columnHints = [[4], [2], [2, 2], [6], [3, 2], [1,2], [2], [1,2]]
// rowHints = [[3, 1], [1,4], [1,2,1], [1,1,2], [7], [5]]
// answer = [
//   0, 0, 1, 1, 1, 0, 0, 1,
//   1, 0, 1, 1, 1, 1, 0, 0,
//   1, 0, 0, 1, 1, 0, 0, 1,
//   1, 0, 0, 1, 0, 0, 1, 1,
//   1, 1, 1, 1, 1, 1, 1, 0,
//   0, 1, 1, 1, 1, 1, 0, 0
// ]



// UserDispatch 라는 이름으로 내보내줍니다.
export const UserDispatch = React.createContext(null);


function App() {

  // 실패 1 (오답)
  // width = 8
  // height = 8
  // columnHints = [[1, 1], [1], [], [2], [], [1, 1], [1, 1], [1, 2, 1]]
  // rowHints = [[1, 3], [], [1], [], [1, 2], [1, 1], [1], [1, 1]]

  // 실패 2 (오답)
  // width = 10
  // height = 8
  // columnHints = [[2, 1, 2], [1], [1, 1], [2, 2, 1], [1, 5], [1], [2], [3, 1, 1], [1, 1], [1, 1]]
  // rowHints = [[2], [1, 2, 2], [1, 1, 3], [1, 1], [1, 2, 1], [3, 1], [1, 1, 1], [1, 3, 2]]

  // 실패 3 (안끝남)
  // width = 8
  // height = 6
  // columnHints = [[1, 1], [], [1], [1], [1, 1], [1], [1], [2]]
  // rowHints = [[1], [], [1, 1], [2], [2], [1, 1, 1]]

  // 실패 4 (안끝남)
  width = 12
  height = 8
  columnHints = [[2], [1, 1], [1, 1, 1, 1], [1, 2, 1, 1], [1, 1], [1], [1, 1, 1], [1], [1, 4], [], [1, 3], [1]]
  rowHints = [[3, 1, 1], [], [3, 1, 1, 1], [1, 1, 1], [1, 1, 2], [1, 1], [3, 1], [1, 2, 3]]
  
  let start = new Date();
  const result = solve(width, height, columnHints, rowHints)
  let end = new Date();
  console.log( (end - start)/1000 )

  return (
    <div>
      {result}
    </div>
  );
}

export default App;