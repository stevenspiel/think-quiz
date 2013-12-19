window.Think = window.Think || {}
window.Think = _.extend(window.Think, {
    initialize: function() {
        this.currentQuestionNumber = 0;
        this.optionCounter = 0;
        this.setUpEvents();
        this.showCurrentQuestion();
        this.listener();
        this.answersArray = [];
        this.answerSet = [];
        this.totals = {};
        this.count = 0;
    },
    setUpEvents: function() {},
    showCurrentQuestion: function() {
        var question = this.currentQuestion();
        var buttonHtml = "";
        for (var i in question.answers) {
            var answer = question.answers[i];
            buttonHtml = buttonHtml + "<input type='checkbox' class='individual-checkbox' value='" + answer.category + "'>" + answer.name + "<br>";
        };
        $('.buttons').html(buttonHtml);
    },
    currentQuestion: function() {
        return this.questions[this.currentQuestionNumber];
    },
    // count: function(number) { //limit checkbox selections to 2
    //   var currentCount = number + 1;
    //   if (currentCount === 2) { //show next button when two is reached
    //     document.getElementById(questionNumber).style.position="relative";
    //     document.getElementById(questionNumber).style.left="0px";
    //   } else if (currentCount > 2) { // alert if 3 are chosen
    //     alert("only select two words");
    //   }
    // },
    transition: function() {
        alert();
        // fading or sliding transition instead of alert
    },
    checkbox: function(characteristicsArray, valuesArray, questionNumber) { //print checkboxes
        for (var i = 0; i <= 3; i++) {
            document.write('<div id="' + questionNumber + '"><input type="checkbox" name="' + questionNumber + '.' + (i + 1) + '" value="' + valuesArray[i] + '" onclick="count(1)"/>' + characteristicsArray[i] + '</div><br/>'); //count is not defined?
        }
    },
    // form: function(characteristicsArray, valuesArray) { //print form
    //     var questionNumber = 0;
    //     questionNumber++;
    //     var instructions = "Read each set of words and mark the TWO within each set that best describe you.<br/>";
    //     var nextButton = '<input type="submit" value="next"/>'; // changing to onclick="transition()" doesn't work
    //     var nextButtonHidden = '<input type="submit" value="next" style="position: absolute; left: -9999px; width: 1px; height: 1px;"/>'; //want to hide nextButton until 2 selections made
    //     if (questionNumber === 1) { //Starting page
    //         document.write('<h1>Take the Quiz</h1>');
    //         document.write("<form>");
    //         document.write(instructions);
    //     } else { // in-between pages
    //         document.write('--progress bar--');
    //         document.write(instructions);
    //     }
    //     document.write(checkbox(characteristicsArray, valuesArray, questionNumber));
    //     if (questionNumber === 15) { //last question's tail
    //         document.write('</form>');
    //         document.write('<button id="back">back</button>');
    //         document.write(nextButton);
    //         document.write('<button>finish</button>');
    //     } else if (questionNumber === 1) { //first question's tail
    //         document.write(nextButton);
    //     } else { // middle questions' tail
    //         document.write('<button id="back">back</button>');
    //         document.write(nextButton);
    //     }
    // },
    updateQuestionNumber: function(direction) {
        if(direction === "forward"){
            this.currentQuestionNumber += 1;
        } else if (direction === "back"){
            this.currentQuestionNumber -= 1;
        }
    },
    listener: function() {
        var thinkObject = this;
        document.addEventListener('change',function(e){
          if(e.target.checked){
            thinkObject.optionCounter += 1;
            if (thinkObject.optionCounter === 2){
              document.getElementById('next').disabled = false;
            } else if (thinkObject.optionCounter !== 2){
              document.getElementById('next').disabled = true;
            }
            thinkObject.answerSet.push(e.target.value);
          } else {
            thinkObject.optionCounter -= 1;
            if (thinkObject.optionCounter === 2){
              document.getElementById('next').disabled = false;
            } else if (thinkObject.optionCounter !== 2){
              document.getElementById('next').disabled = true;
            }
            thinkObject.answerSet = _.without(thinkObject.answerSet, e.target.value);
          }
        });
        document.getElementById('next').addEventListener('click', function() {
            if (thinkObject.currentQuestionNumber === Think.questions.length-1){
              thinkObject.addAnswersToArray(thinkObject.answerSet);
              thinkObject.answerSet = []
              thinkObject.showResults(thinkObject.answersArray);
            } else if (thinkObject.optionCounter === 2){
              thinkObject.updateQuestionNumber("forward");
              thinkObject.showCurrentQuestion();
              thinkObject.optionCounter = 0;
              document.getElementById('back').disabled = false;
              document.getElementById('next').disabled = true;
              thinkObject.addAnswersToArray(thinkObject.answerSet);
              thinkObject.answerSet = []
            }
          console.log(Think.questions.length - thinkObject.currentQuestionNumber + " questions left");
        }); 
        document.getElementById('back').addEventListener('click', function() {
            thinkObject.updateQuestionNumber("back");
            thinkObject.showCurrentQuestion();
            thinkObject.optionCounter = 0;
            if (thinkObject.currentQuestionNumber === 0){
              document.getElementById('back').disabled = true;
            }
        });   
    },
    showResults: function(){
      var thinkObject = this;
      var letters = ["CS","AS","AR","CR"];
      var flatArray = [].concat.apply([],this.answersArray);
      for (var letter in letters){
          thinkObject.sumArrayTypes(letters[letter],flatArray);
          thinkObject.totals[letters[letter]] = thinkObject.count;
          thinkObject.count = 0;
      }
      console.log(this.totals);
    },
    addAnswersToArray: function(answerSet){
      this.answersArray.push(answerSet);
    },
    sumArrayTypes: function(x,array) {
      var thinkObject = this;
      for (var answer in array){
        if(array[answer] === x){
          thinkObject.count++;
        }
      }
    }
});

