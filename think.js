window.Think = window.Think || {}
window.Think = _.extend(window.Think, {
  initialize: function() {
    this.currentQuestionNumber = 0;
    this.setUpEvents();
    this.showCurrentQuestion();
  },
  setUpEvents: function() {},
  showCurrentQuestion: function() {
    var question = this.currentQuestion();
    var buttonHtml = "";
    for (var i in question.answers) {
      var answer = question.answers[i];
      buttonHtml = buttonHtml + "<input type='checkbox' value='" + answer.category + "'>" + answer.name + "<br>";
    };
    $('.buttons').html(buttonHtml);
  },
  currentQuestion: function() {
    return this.questions[this.currentQuestionNumber];
  },

  count: function(number) { //limit checkbox selections to 2
    var currentCount = number + 1;
    if (currentCount === 2) { //show next button when two is reached
      document.getElementById(questionNumber).style.position="relative";
      document.getElementById(questionNumber).style.left="0px";
    } else if (currentCount > 2) { // alert if 3 are chosen
      alert("only select two words");
    }
  },
  transition: function() {
    alert();
    // fading or sliding transition instead of alert
  },
  checkbox: function(characteristicsArray,valuesArray,questionNumber) { //print checkboxes
    for (var i = 0; i <= 3; i++) {
      document.write('<div id="'+questionNumber+'"><input type="checkbox" name="'+questionNumber+'.'+(i+1)+'" value="'+valuesArray[i]+'" onclick="count(1)"/>'+characteristicsArray[i]+'</div><br/>'); //count is not defined?
    }
  },
  form: function(characteristicsArray,valuesArray) { //print form
    var questionNumber = 0;
    questionNumber++;
    var instructions = "Read each set of words and mark the TWO within each set that best describe you.<br/>";
    var nextButton = '<input type="submit" value="next" onclick="alert()"/>'; // changing to onclick="transition()" doesn't work
    var nextButtonHidden = '<input type="submit" value="next" style="position: absolute; left: -9999px; width: 1px; height: 1px;"/>'; //want to hide nextButton until 2 selections made
    if (questionNumber === 1) { //Starting page
      document.write('<h1>Take the Quiz</h1>');
      document.write("<form>");
      document.write(instructions);
    } else { // in-between pages
      document.write('--progress bar--');
      document.write(instructions);
    }
    document.write(checkbox(characteristicsArray,valuesArray,questionNumber));
    if (questionNumber === 15) { //last question's tail
      document.write('</form>');
      document.write('<button id="back">back</button>');
      document.write(nextButton);
      document.write('<button>finish</button>');
    } else if (questionNumber === 1) { //first question's tail
      document.write(nextButton);
    } else { // middle questions' tail
      document.write('<button id="back">back</button>');
      document.write(nextButton);
    }
  }
});

// grid = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
// grid[1][0]
// for (var row = 0; row < row_size; row++) {
//   for (var col = 0; col < col_size; col++) {
//     // checkForHoriz
//     // checkForVertical
//     // checkForDiagonal
//     if (grid[row][col] == grid[row+1][col+1] && grid[row][col] == grid[row+2][col+2])
//   }
// }