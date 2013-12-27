window.Think = window.Think || {}
window.Think = _.extend(window.Think, {
    initialize: function() {
        this.currentQuestionNumber = 0;
        this.answersArray = [];
        this.answerSet = [];
        this.totals = {};
        this.count = 0; 
        this.optionCounter = 0; //change to length of currentlySelected
        this.currentlySelected = [];
        this.currentlyNotSelected = [this.currentQuestionNumber + "CS",this.currentQuestionNumber + "AS", this.currentQuestionNumber + "AR", this.currentQuestionNumber + "CR"];
        this.goingBack = 0;
        this.showCurrentQuestion();
        this.initializeListeners();
    },
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
    initializeListeners: function() {
        var that = this;
        document.addEventListener('change', function(event) { that.onCheckboxChange(event) });
        document.getElementById('next').addEventListener('click', function(event) { that.onClickNext(event) });
        document.getElementById('back').addEventListener('click', function(event) { that.onClickBack(event) });
    },
    onCheckboxChange: function(e) {
        var checkbox = e.target;
        var currentId = this.currentQuestionNumber + checkbox.value;
        // var selectedCheckboxes = $(':checkbox:checked');
        if (checkbox.checked) {
            this.optionCounter += 1;
            //use currentlySelected.length instead of keeping track of counter
            if (this.optionCounter > 2){
                var mostRecent = this.currentlySelected.pop();
                this.currentlySelected = _.without(this.currentlySelected,mostRecent);
                this.currentlyNotSelected.push(mostRecent);
                this.optionCounter -= 1;
            }
            this.currentlySelected.push(currentId);
            this.currentlyNotSelected = _.without(this.currentlyNotSelected,currentId);
            // only update answerSet on onClickNext
            this.answerSet.push(checkbox.value);
            if (this.optionCounter >= 2){
                document.getElementById('next').disabled = false;
                for(var unchecked in this.currentlyNotSelected){
                    document.querySelector('label[for="'+ this.currentlyNotSelected[unchecked]+'"]').className = "checkbox-label-disabled";
                    document.getElementById(this.currentlyNotSelected[unchecked]).checked = false;
                }
            } else if (this.optionCounter < 2) {
                document.getElementById('next').disabled = true;
            }
            checkbox.parentNode.className = "option-selected";
        } else {
            this.optionCounter -= 1;
            if (this.optionCounter < 2){
                for (var unchecked in this.currentlyNotSelected){
                    document.querySelector('label[for="'+ this.currentlyNotSelected[unchecked]+'"]').className = "";
                }
            }
            this.currentlyNotSelected.push(currentId);
            this.currentlySelected = _.without(this.currentlySelected, currentId);
            checkbox.parentNode.className = "option-not-selected";
            document.getElementById('next').disabled = true;
        }
    },
    onClickNext: function() {
        var isLastQuestion = (this.currentQuestionNumber === Think.questions.length - 14);
        if (isLastQuestion) {
            this.updateQuestionNumber("forward");
            this.addAnswersToArray(this.currentlySelected);
            this.answerSet = []
            this.showResults(this.answersArray);
        } else if (this.optionCounter === 2) {
            this.updateQuestionNumber("forward");
            this.showCurrentQuestion();
            document.getElementById('back').disabled = false;
            document.getElementById('next').disabled = true;
            this.addAnswersToArray(this.currentlySelected);
            this.answerSet = [];
        }
        if (this.currentQuestionNumber < 15) {
            console.log(Think.questions.length - this.currentQuestionNumber + " questions left");
        }
        this.reset();
    },
    onClickBack: function() {
        this.updateQuestionNumber("back");
        this.answersArray = this.answersArray.slice(0,this.currentQuestionNumber);
        this.showCurrentQuestion();
        var isFirstQuestion = (this.currentQuestionNumber === 0);
        if (isFirstQuestion) {
            document.getElementById('back').disabled = true;
        }
        this.reset();
    },
    //render function to take care of HTML view
    showResults: function(resultsArray) {
        if (resultsArray.length === 15) {
            console.log("Successful Test");
        } else {
            console.log("Full Test was Unsuccessful");
        }
    },
    totalResults: function() {
        var flatAnswersArray = [].concat.apply([],this.answersArray)
        var letters = ["CS", "AS", "AR", "CR"];
        for (var letter in letters) {
            this.sumArrayTypes(letters[letter], flatAnswersArray);
            this.totals[letters[letter]] = this.count;
            this.count = 0;
        }
        console.log(this.totals);
        document.getElementById('buttons').innerHTML = this.totalResults();
        // var flatAnswersArrayNoNumbers = flatAnswersArray.replace(/\d+/, '');
        // console.log(flatAnswersArrayNoNumbers);
        // return this.sumArrayTypes(flatAnswersArrayNoNumbers);
        // console.log("answersArray: "+this.answersArray);
        // return _(this.answersArray).countBy(function(answer) {
        //     console.log("replace:" + answer.replace(/\d+/, ''));            
        //     return answer.replace(/\d+/, '');
        // }); // {CS: 5, AS: 10, AR: 7, CR: 8}
    },
    addAnswersToArray: function(answerSet) {
        this.answersArray.push(answerSet);
    },
    sumArrayTypes: function(x, array) {
        for (var answer in array) {
            if (array[answer].replace(/\d+/, '') === x) {
                this.count++;
            }
        }
    }
});


// <?
// start_time = Time.now;
// Thing1;
// log (Elapsed for Thing1: Time.now - start_time) if elapsed_time > 500
// start_time = Time.now;
// thing2;
// log (Elapsed for thing2: Time.now - start_time) if elapsed_time > 500
// start_time = Time.now;
// thing3;
// log (Elapsed for thing3: Time.now - start_time) if elapsed_time > 500
// start_time = Time.now;
// ?>
