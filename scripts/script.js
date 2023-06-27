let examStatus = "started"; // started , finished
let questions;
let time,
  elapsed = 0;
let qn = 0;
let len;
let wrongAnswers = 0,
  rightAnswers = 0;
let timer;

// get link and save the questions:
$("#start").click(function () {
  let link = $("#link").val();
  $.get(link, function (data, status) {
    questions = data.questions;
    len = questions.length;
    time = data.time * 60;
    startExam();
  });
  timer = setInterval(updateTimer, 1000);
});

function updateTimer() {
  elapsed++;
  let remaining = time - elapsed;
  if (remaining <= 0) {
    endExam();
    return;
  }
  let min = parseInt(remaining / 60);
  let sec = remaining % 60;
  $("#q-time").text(`زمان باقی مانده: ${min} دقیقه و ${sec} ثانیه`);
}

$("#showresult").click(function () {
  if (examStatus == "started") {
    endExam();
  }
  $("#modal").modal("show");
});

$("#closemodal").click(function () {
  $("#modal").modal("hide");
});

function endExam() {
  // clear timer
  clearInterval(timer);
  $("#q-time").text("آزمون به پایان رسید.");
  $("#showresult").text("نمایش نتایج");
  examStatus = "finished";
  questions.forEach((q) => {
    if (q.answer == q.true) {
      rightAnswers++;
    } else {
      wrongAnswers++;
    }
  });

  $("#truecount").text(rightAnswers);
  $("#falsecount").text(wrongAnswers);
  $("#percentage").text(parseFloat((rightAnswers / len) * 100).toFixed(2));
  $("#passed")
    .text(rightAnswers >= len / 2 ? "قبول" : "مردود")
    .addClass(rightAnswers >= len / 2 ? "bg-success" : "bg-danger");
  // re-render page for showing answers
  qn = 0;
  renderQuestion();
  // show newExam option
  $("#newExam").css("display", "inline");
  $("#modal").modal("show");
}

// function to start Exam
function startExam() {
  // hide the start screen
  $("#starter").addClass("hideitem");
  // show the question page
  $("#question").css("display", "block");
  renderQuestion();
}

function renderQuestion() {
  // check for next/prev disabling
  if (qn == len - 1) {
    $("#nextquestion").attr("disabled", "disabled");
  } else {
    $("#nextquestion").removeAttr("disabled");
  }
  if (qn == 0) {
    $("#prevquestion").attr("disabled", "disabled");
  } else {
    $("#prevquestion").removeAttr("disabled");
  }
  // empty answers
  $("#answers").empty();
  //set title of question
  $("#question-title").text("سوال " + parseInt(qn + 1));
  // show the first question
  $("#q-title").text(questions[qn].title);
  let answer = questions[qn].answer;
  let trueAnswer = questions[qn].true;
  questions[qn].answers.forEach((item, index) => {
    let checked = "";
    let classNames = "";
    if (answer && index + 1 == answer) {
      checked = "checked";
      if (examStatus == "finished") {
        if (answer !== trueAnswer) {
          classNames += "wrongAnswer text-white";
        }
      } else {
        classNames += "checked ";
      }
    }
    if (examStatus == "finished" && index + 1 == trueAnswer) {
      classNames += "trueAnswer text-white ";
    }
    let label = $("<label/>")
      .addClass("option card text-secondary mt-2 p-2 " + classNames)
      .click(function () {
        answerFunction(index + 1);
      })
      .text(item);
    label.append(`<input type="radio" name="answer" ${checked}/>`);
    $("#answers").append(label);
  });
}

function answerFunction(option) {
  questions[qn].answer = option;
  renderQuestion();
}

$("#nextquestion").click(nextquestion);
function nextquestion() {
  if (qn + 1 < len) {
    qn++;
    renderQuestion();
  }
}
$("#prevquestion").click(prevquestion);

function prevquestion() {
  if (qn - 1 >= 0) {
    qn--;
    renderQuestion();
  }
}

$("#newExam").click(function () {
  examStatus = "started";
  questions = [];
  time = 0;
  elapsed = 0;
  qn = 0;
  wrongAnswers = 0;
  rightAnswers = 0;
  $("#starter").removeClass("hideitem");
  $("#question").css("display", "none");
  $("#newExam").css("display", "none");
});
