const mainDiv = document.querySelector('.main-div');
const answersPage = document.querySelector('.answersPage');
const question = document.querySelector('.question');
const option1 = document.querySelector('#option1');
const option2 = document.querySelector('#option2');
const option3 = document.querySelector('#option3');
const option4 = document.querySelector('#option4');
const answers = document.querySelectorAll('.answer');
const messageBox = document.querySelector('.message');
const nextBtn = document.querySelector('.next');
const innerDiv = document.querySelector('.inner-div');
const submitDiv = document.querySelector('.submitContainer');
const submitButton = document.querySelector('.submitButton');
const scoreArea = document.querySelector('.scoreArea');

let questionNo = 0;
let pageNo = 1;
let correctAnswers = 0;
let wrongAnswers = 0;

const getData = async () => {
  try {
    let result = await fetch('questions.json');
    let data = await result.json();
    data = data.questions;
    return data;
  } catch (error) {
    console.log(error);
  }
};

//PAGINATE
function paginate(array, page_size, page_number) {
  return array.slice((page_number - 1) * page_size, page_number * page_size);
}

//LOAD QUESTION
const loadQuestion = () => {
  window.scrollTo(0, 0);
  getData().then((allData) => {
    //clear the message box
    messageBox.innerText = '';
    //uncheck radio buttons
    answers.forEach((opt) => {
      if (opt.checked) {
        opt.checked = false;
      }
    });

    allData = paginate(allData, 4, pageNo);

    let questionDom = '';
    allData.length !== 0
      ? allData.forEach((data) => {
          questionDom += `<h2 class="question">${data.number}. ${data.question}</h2>
          <ul>
            <li>
              <input type="radio" name="answer${data.number}" id="0" class="answer${data.number}" />
              <label for="ans1" id="option1">${data.answers[0]}</label>
            </li>
            <li>
              <input type="radio" name="answer${data.number}" id="1" class="answer${data.number}" />
              <label for="ans2" id="option2">${data.answers[1]}</label>
            </li>
            <li>
              <input type="radio" name="answer${data.number}" id="2" class="answer${data.number}" />
              <label for="ans3" id="option3">${data.answers[2]}</label>
            </li>
            <li>
              <input type="radio" name="answer${data.number}" id="3" class="answer${data.number}" />
              <label for="ans4" id="option4">${data.answers[3]}</label>
            </li>
          </ul>`;
        })
      : (questionDom = `<h1>No more questions</h1>`);

    innerDiv.innerHTML = questionDom;
    /*submitBtn.addEventListener('click', () => {
      let checkedOption = getCheckedOption();
      if (Number(checkedOption) === data.correctIndex) {
        messageBox.innerText = 'Correct Answer';
      } else {
        messageBox.innerText = 'Wrong Answer';
      }
    });*/
  });
};

//CHECKED ANSWERS
let checkedOptionsArray = [];
//CHECKING IF IT'S THE LAST PAGE OF QUESTIONS AND RENDER THE SUBMIT BUTTON INSTEAD OF NEXT BUTTON
const checkSubmit = () => {
  if (checkedOptionsArray.length === 8) {
    nextBtn.style.visibility = 'hidden';
    submitDiv.innerHTML = `<button class="btn" id="submitButton" onclick="submitHandler()">Submit</button>`;
  }
};

//SHOW THE SCORE
const showScore = (allData) => {
  if (correctAnswers + wrongAnswers === allData.length) {
    scoreArea.style.display = 'block';
    scoreArea.innerHTML = `<h2 style="color : blue">Your score : ${correctAnswers}/${allData.length}</h2>`;
  }
};

//GET CORRECT OR INCORRECT ICON
const getIcon = (userAnswer, correctAnswer, allData) => {
  if (userAnswer === correctAnswer) {
    correctAnswers += 1;
    showScore(allData);

    return `<i class="fas fa-check-circle" style="font-size: 1.5em; color: green;"></i>`;
  } else {
    wrongAnswers += 1;
    showScore(allData);

    return `<i class="fas fa-times-circle" style="font-size: 1.5em; color: Tomato;"></i>`;
  }
};

//DISPLAY THE ANSWERSHEET
const answerSheet = (a) => {
  let answersheetDOM = '';
  getData().then((allData) => {
    allData.forEach((data, index) => {
      answersheetDOM += `<h2>${data.number}. ${data.question}</h2>
      <h5 style="color: blue"><span class="checkIcon">${getIcon(
        data.answers[a[index]],
        data.answers[data.correctIndex],
        allData
      )}</span>   Your answer: ${data.answers[a[index]]}</h5> 
      <h5 style="color: #69f72d">Correct answer: ${
        data.answers[data.correctIndex]
      }</h5>`;
      // if (data.answers[a[index]] === data.answers[data.correctIndex]) {
      //   document.querySelector('.checkIcon').innerText = 'Correct';
      // } else {
      //   document.querySelector('.checkIcon').innerText = 'Wrong';
      // }
    });
    answersPage.innerHTML = answersheetDOM;
  });
};
// answerSheet();

//SUBMIT BUTTON HANDLER
const submitHandler = async () => {
  let res = await checkValidation();
  checkedOptionsArray.push(...res);
  if (res !== null) {
    mainDiv.style.display = 'none';
    answersPage.style.display = 'flex';
    //DISPLAY THE ANSWERSHEET
    answerSheet(checkedOptionsArray);
  } else {
    messageBox.innerText = 'Please answer all questions.';
  }
};

//CHECK ALL QUESTIONS IN THE CURRENT SCREEN ARE ANSWERED OR NOT
const checkValidation = async () => {
  let data;
  let tempArray = [];

  await getData().then((allData) => {
    data = paginate(allData, 4, pageNo);
    data.forEach((opt) => {
      const radioBtns = document.querySelectorAll(`.answer${opt.number}`);
      radioBtns.forEach((btn) => {
        if (btn.checked) {
          tempArray.push(btn.id);
        }
      });
    });
  });
  if (tempArray.length === 4) {
    return tempArray;
  } else {
    return null;
  }
};

//NEXT QUESTION
const nextPage = async () => {
  let res = await checkValidation();

  if (res !== null) {
    pageNo += 1;
    checkedOptionsArray.push(...res);
    loadQuestion();
  } else {
    messageBox.innerText = 'Please answer all questions.';
  }
  checkSubmit();
  // let data;
  // let tempArray = [];
  // getData().then((allData) => {
  //   data = paginate(allData, 4, pageNo);
  //   data.forEach((opt) => {
  //     const radioBtns = document.querySelectorAll(`.answer${opt.number}`);
  //     radioBtns.forEach((btn) => {
  //       if (btn.checked) {
  //         tempArray.push(btn.id);
  //       }
  //     });
  //   });
  //   if (tempArray.length === 4) {
  //     pageNo += 1;
  //     checkedOptionsArray.push(...tempArray);
  //     loadQuestion();
  //   } else {
  //     tempArray = [];
  //     messageBox.innerText = 'Please answer all questions.';
  //   }
  //   checkSubmit();
  //   console.log(checkedOptionsArray);
  // });
};
nextBtn.addEventListener('click', nextPage);

//ON DOM LOAD
document.addEventListener('DOMContentLoaded', () => {
  loadQuestion();
});
// const getCheckedOption = () => {
//   let checkedopt;
//   answers.forEach((opt) => {
//     if (opt.checked) {
//       checkedopt = opt.id;
//     }
//   });
//   return checkedopt;
// };
