const question = document.querySelector('.question');
const option1 = document.querySelector('#option1');
const option2 = document.querySelector('#option2');
const option3 = document.querySelector('#option3');
const option4 = document.querySelector('#option4');
const submitBtn = document.querySelector('#submit_btn');
const answers = document.querySelectorAll('.answer');
const messageBox = document.querySelector('.message');
const nextBtn = document.querySelector('.next');
const innerDiv = document.querySelector('.inner-div');

let questionNo = 0;
let pageNo = 1;

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
    // submitBtn.addEventListener('click', () => {
    //   let checkedOption = getCheckedOption();
    //   if (Number(checkedOption) === data.correctIndex) {
    //     messageBox.innerText = 'Correct Answer';
    //   } else {
    //     messageBox.innerText = 'Wrong Answer';
    //   }
    // });
  });
};

//CHECKED ANSWERS
let checkedOptionsArray = [];
//NEXT QUESTION
const nextPage = () => {
  let data;
  let tempArray = [];
  getData().then((allData) => {
    data = paginate(allData, 4, pageNo);
    data.forEach((opt) => {
      const radioBtns = document.querySelectorAll(`.answer${opt.number}`);
      radioBtns.forEach((btn) => {
        if (btn.checked) {
          tempArray.push(btn.id);
        }
      });
    });
    if (tempArray.length === 4) {
      pageNo += 1;
      checkedOptionsArray.push(...tempArray);
      loadQuestion();
    } else {
      tempArray = [];
      messageBox.innerText = 'Please answer all questions.';
    }
    console.log(checkedOptionsArray);
  });
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
