window.Think = window.Think || {}
window.Think = _.extend(window.Think, {
    initialize: function() {
        this.currentQuestionNumber = 0;
        // this.setUpEvents();
        this.showCurrentQuestion();
        this.listener();
        this.answersArray = [];
        this.answerSet = [];
        this.totals = {};
        this.count = 0; 
        this.optionCounter = 0; //change to length of currentlySelected
        this.currentlySelected = [];
        this.currentlyNotSelected = [this.currentQuestionNumber + "CS",this.currentQuestionNumber + "AS", this.currentQuestionNumber + "AR", this.currentQuestionNumber + "CR"];
        this.goingBack = 0;
    },
    // setUpEvents: function() {},
    showCurrentQuestion: function() {
        var question = this.currentQuestion();
        var buttonHtml = "";
        for (var i in question.answers) {
            var answer = question.answers[i];
            var id = this.currentQuestionNumber + answer.category
            buttonHtml = buttonHtml + "<label for='" + id + "'><input type='checkbox' id='" + id + "'class='individual-checkbox' value='" + answer.category + "'>" + answer.name + "</label><br>";
        };
        $('.buttons').html(buttonHtml);
    },
    currentQuestion: function() {
        return this.questions[this.currentQuestionNumber];
    },
    updateQuestionNumber: function(direction) {
        if (direction === "forward") {
            this.currentQuestionNumber += 1;
        } else if (direction === "back") {
            this.currentQuestionNumber -= 1;
        }
    },
    reset: function(){
        this.optionCounter = 0;
        this.currentlySelected = [];
        this.currentlyNotSelected = [this.currentQuestionNumber + "CS",this.currentQuestionNumber + "AS", this.currentQuestionNumber + "AR", this.currentQuestionNumber + "CR"];
    },
    listener: function() {
        var o = this;
        document.addEventListener('change', function(e) {
            var currentId = o.currentQuestionNumber + e.target.value;
            if (e.target.checked) {
                o.optionCounter += 1;
                if (o.optionCounter > 2){
                    var mostRecent = o.currentlySelected.pop();
                    o.currentlySelected = _.without(o.currentlySelected,mostRecent);
                    o.currentlyNotSelected.push(mostRecent);
                    o.optionCounter -= 1;
                }
                // console.log("option counter: " + o.optionCounter)
                o.currentlySelected.push(currentId)
                o.currentlyNotSelected = _.without(o.currentlyNotSelected,currentId)
                o.answerSet.push(e.target.value);
                // console.log("currently selected: "+o.currentlySelected);
                // console.log("currently not selected: "+o.currentlyNotSelected);
                if (o.optionCounter >= 2){
                    document.getElementById('next').disabled = false;
                    for(var unchecked in o.currentlyNotSelected){
                        document.querySelector('label[for="'+ o.currentlyNotSelected[unchecked]+'"]').className = "checkbox-label-disabled";
                        document.getElementById(o.currentlyNotSelected[unchecked]).checked = false;
                    }
                } else if (o.optionCounter < 2) {
                    document.getElementById('next').disabled = true;
                }
                e.target.parentNode.className = "option-selected";
            } else {
                o.optionCounter -= 1;
                if (o.optionCounter < 2){
                    for (var unchecked in o.currentlyNotSelected){
                        document.querySelector('label[for="'+ o.currentlyNotSelected[unchecked]+'"]').className = "";
                    }
                }
                // console.log("option counter: " + o.optionCounter);               
                // if (o.optionCounter === 2) {
                //     document.getElementById('next').disabled = false;
                // } else if (o.optionCounter !== 2) {
                //     document.getElementById('next').disabled = true;
                // }
                o.currentlyNotSelected.push(currentId);
                o.currentlySelected = _.without(o.currentlySelected, currentId);
                e.target.parentNode.className = "option-not-selected";
            }
        });
        document.getElementById('next').addEventListener('click', function() {
            if (o.currentQuestionNumber === Think.questions.length - 1) {
                o.addAnswersToArray(o.answerSet);
                o.answerSet = []
                o.showResults(o.answersArray);
            } else if (o.optionCounter === 2) {
                o.updateQuestionNumber("forward");
                o.showCurrentQuestion();
                document.getElementById('back').disabled = false;
                document.getElementById('next').disabled = true;
                o.addAnswersToArray(o.answerSet);
                o.answerSet = []
            }
            if (o.currentQuestionNumber > 1){
                console.log(Think.questions.length - o.currentQuestionNumber + " questions left");
            }
            o.reset();
        });
        document.getElementById('back').addEventListener('click', function() {
            o.updateQuestionNumber("back");
            o.answersArray = o.answersArray.slice(0,o.currentQuestionNumber);
            o.showCurrentQuestion();
            if (o.currentQuestionNumber === 0) {
                document.getElementById('back').disabled = true;
            }
            o.reset();
        });
    },
    showResults: function(resultsArray) {
        var o = this;
        console.log(resultsArray);
        var letters = ["CS", "AS", "AR", "CR"];
        var flatArray = [].concat.apply([], resultsArray);
        console.log(flatArray);
        for (var letter in letters) {
            o.sumArrayTypes(letters[letter], flatArray);
            o.totals[letters[letter]] = o.count;
            o.count = 0;
        }
        console.log(this.totals);
    },
    addAnswersToArray: function(answerSet) {
        this.answersArray.push(answerSet);
    },
    sumArrayTypes: function(x, array) {
        var o = this;
        for (var answer in array) {
            if (array[answer] === x) {
                o.count++;
            }
        }//,
    // count: function(number) { //limit checkbox selections to 2
    //   var currentCount = number + 1;
    //   if (currentCount === 2) { //show next button when two is reached
    //     document.getElementById(questionNumber).style.position="relative";
    //     document.getElementById(questionNumber).style.left="0px";
    //   } else if (currentCount > 2) { // alert if 3 are chosen
    //     alert("only select two words");
    //   }
    // },
    // transition: function() {
    //     alert();
    //     // fading or sliding transition instead of alert
    // },
    // checkbox: function(characteristicsArray, valuesArray, questionNumber) { //print checkboxes
    //     for (var i = 0; i <= 3; i++) {
    //         document.write('<div id="' + questionNumber + '"><input type="checkbox" name="' + questionNumber + '.' + (i + 1) + '" value="' + valuesArray[i] + '" onclick="count(1)"/>' + '<label for="">' + characteristicsArray[i] + '</label></div><br/>'); //count is not defined?
    //     }
    // },
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
    // }
    }
});
