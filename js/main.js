let startBtn = document.querySelector(".start");
let welcome_page = document.querySelector(".welcome_page");
let maincont = document.querySelector(".main");
let timeLine = document.querySelector(".time_line");

let counter;
let LineCounter;
let time_line;
let selectV = false;
let result = 0;

let qusetionsNumber;
let currentIndex = 0;
let questionsObject;

function getQuestions() {
  let myRequest = new XMLHttpRequest();

  myRequest.open("GET", "js/questions.json", true);
  myRequest.send();

  myRequest.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      questionsObject = JSON.parse(this.responseText);
      qusetionsNumber = questionsObject.length;
    }
  };
}

getQuestions();

let trueIconDiv = `<div class="icon tick"><i class="fas fa-check"></i></div>`;
let falseIconDiv = `<div class="icon cross"><i class="fas fa-times"></i></div>`;

function optionISelect(ans) {
  let anss = document.querySelectorAll(".ans");
  selectV = true;
  let correctAns = questionsObject[currentIndex].right_answer;
  let selectedAns = ans.textContent;

  correctAns = correctAns.replace(/&lt/g, "<");
  correctAns = correctAns.replace(/&gt/g, ">");

  if (selectedAns == correctAns) {
    ans.classList.add("true");
    ans.innerHTML += trueIconDiv;
    result += 1;
  } else {
    ans.classList.add("false");
    ans.innerHTML += falseIconDiv;
    for (let i = 0; i < anss.length; i++) {
      // select correct answer if the selected ans is false.
      if (anss[i].textContent == correctAns) {
        anss[i].classList.add("true");
        anss[i].innerHTML += trueIconDiv;
      }
    }
  }

  for (let i = 0; i < anss.length; i++) {
    // disable all answers when user select any answer.
    anss[i].classList.add("disabled");
  }
}

startBtn.onclick = function addqu() {
  selectV = false;
  // Remove welcome page & add questions Counter.
  welcome_page.remove();
  // add qustions numbers (left line)
  let questionsNumsspans = document.createElement("div");
  questionsNumsspans.className = "qu-number";
  for (let i = 0; i < qusetionsNumber; i++) {
    let qusNumspan = document.createElement("span");
    qusNumspan.style.height = `${100 / qusetionsNumber}%`;
    qusNumspan.innerHTML = `${i + 1}`;
    qusNumspan.id = i;
    if (qusNumspan.id == currentIndex) {
      qusNumspan.className = "current";
    }
    questionsNumsspans.appendChild(qusNumspan);
  }

  maincont.appendChild(questionsNumsspans);

  // Add question box.

  let questionsbox = document.createElement("div");
  let questionsboxHeader = document.createElement("header");
  let questionsboxbody = document.createElement("div");
  let questionsboxfooter = document.createElement("footer");
  questionsbox.className = "qus_box";
  questionsboxbody.className = "qus";
  // add header-> title
  let headTitle = document.createElement("div");
  headTitle.innerHTML = "Memo Quiz Application";
  headTitle.className = "title";
  questionsboxHeader.appendChild(headTitle);

  // add header-> timer
  let headtime = document.createElement("div");
  let time_txt = document.createElement("div");
  let sec = document.createElement("div");
  time_txt.innerHTML = "left :";
  headtime.className = "time";
  time_txt.className = "time_txt";
  sec.className = "sec";
  headtime.appendChild(time_txt);
  headtime.appendChild(sec);
  questionsboxHeader.appendChild(headtime);

  // add header-> timeLine
  time_line = document.createElement("div");
  time_line.className = "time_line";
  questionsboxHeader.appendChild(time_line);
  questionsbox.appendChild(questionsboxHeader);

  startTimer(15);
  startTimeLine(0);

  // Add Questions data
  function addQustionData(obj) {
    let qus_text = document.createElement("div");
    qus_text.innerHTML = obj.title;
    qus_text.className = "qus_text";
    questionsboxbody.appendChild(qus_text);
    questionsbox.appendChild(questionsboxbody);
  }

  addQustionData(questionsObject[currentIndex]);

  // add answers function
  function addAnswers(obj) {
    // add options div
    let options = document.createElement("div");
    options.className = "options";
    questionsboxbody.appendChild(options);
    // add answer loop.
    for (let i = 1; i <= 4; i++) {
      let ans_div = document.createElement("div");
      ans_div.className = "ans";
      let ans = document.createElement("span");
      ans.innerHTML = obj[`answer_${i}`];
      ans_div.appendChild(ans);
      ans_div.setAttribute("onclick", "optionISelect(this)");
      options.appendChild(ans_div);
    }
    questionsbox.appendChild(questionsboxbody);
  }
  addAnswers(questionsObject[currentIndex]);

  // Adding box footer...........

  function addFooter() {
    let achievement = document.createElement("div");
    achievement.className = "achievement";
    achievement.textContent = `${
      currentIndex + 1
    } of ${qusetionsNumber} Questions`;
    questionsboxfooter.appendChild(achievement);
    // create next button.
    let nextBtn = document.createElement("button");
    nextBtn.className = "next_btn";
    nextBtn.textContent = "Next Qus";
    questionsboxfooter.appendChild(nextBtn);
    nextBtn.onclick = () => {
      clearInterval(counter);
      clearInterval(LineCounter);
      currentIndex += 1;
      let qu_numm = document.querySelector(".qu-number");
      let qus_boxx = document.querySelector(".qus_box");
      qu_numm.remove();
      qus_boxx.remove();
      if (currentIndex < qusetionsNumber) {
        addqu();
      } else {
        // Show Result
        maincont.innerHTML += `<div class="result">
        <div class="r_icon">
          <i class="fas fa-crown"></i>
        </div>
        <div class="r_txt">
          You've completed the Quiz! <br />
          and ${
            result > 5 ? "excellent 😍" : "sorry 😐"
          } , You got ${result} out of ${qusetionsNumber}
        </div>
        <div class="btns">
          <button class="replay">Replay Quiz</button>
          <button class="Quit">Quit Quiz</button>
        </div>
      </div>`;

        let replayBtn = document.querySelector(".replay");
        let QuitBtn = document.querySelector(".Quit");

        replayBtn.onclick = function () {
          window.location.reload();
        };

        QuitBtn.onclick = function () {
          let resultBox = document.querySelector(".result");
          resultBox.remove();
          let goodbye_sentence = document.createElement("div");
          goodbye_sentence.textContent = "Thank's for using our app 😍";
          goodbye_sentence.className = "result";
          goodbye_sentence.style.fontSize = "30px";
          goodbye_sentence.style.fontWeight = "500";
          maincont.appendChild(goodbye_sentence);
        };
      }
    };
  }
  addFooter();

  questionsbox.appendChild(questionsboxfooter);
  maincont.appendChild(questionsbox);

  let time_counter = document.querySelector(".sec");

  function startTimer(time) {
    counter = setInterval(timer, 1000);
    function timer() {
      time_counter.innerHTML = time < 10 ? `0${time}` : time;
      if (time > 0 && selectV == false) {
        time--;
      }
      // disable all answers when time is out.
      let anss = document.querySelectorAll(".ans");
      if (time == 0) {
        for (let i = 0; i < anss.length; i++) {
          anss[i].classList.add("disabled");
        }
      }
    }
  }

  function startTimeLine(co) {
    LineCounter = setInterval(Ltimer, 160);
    function Ltimer() {
      if (co < 100 && selectV == false) {
        co += 1;
      }
      time_line.style.width = `${co}%`;
      if (co > 80) {
        time_line.style.backgroundColor = "red";
      }
      if (co == 99) {
        clearInterval(LineCounter);
      }
    }
  }
};
