window.Think = window.Think || {}
window.Think = _.extend(window.Think, {
    initialize: function() {
        this.currentQuestionNumber = 0;
        this.answersArray = [];
        this.finalResults = {};
        this.count = 0; 
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
            var previousSelection = this.currentlySelected[this.currentlySelected.length-1];
            this.currentlySelected.push(currentId);
            if (this.currentlySelected.length > 2) {
                this.currentlySelected = _.without(this.currentlySelected,previousSelection);
                this.currentlyNotSelected.push(previousSelection);
                for (var notSelected in this.currentlyNotSelected) {
                    document.getElementById(this.currentlyNotSelected[notSelected]).checked = false;
                }
            }
            this.currentlyNotSelected = _.without(this.currentlyNotSelected,currentId);
        } else if (checkbox.checked === false){
            this.currentlyNotSelected.push(currentId);
            this.currentlySelected = _.without(this.currentlySelected,currentId);
        }
        console.log(this.currentlySelected);
        console.log(this.currentlyNotSelected);
        this.updateSelectionClass();
    },
    updateSelectionClass: function() {
        for (var selected in this.currentlySelected){
            document.querySelector('label[for="'+ this.currentlySelected[selected]+'"]').className = "option-selected";
            document.getElementById(this.currentlySelected[selected]).checked = true;
        }
        if (this.currentlySelected.length === 2) {
            document.getElementById('next').disabled = false;
            for (var notSelected in this.currentlyNotSelected) {
                document.querySelector('label[for="'+ this.currentlyNotSelected[notSelected]+'"]').className = "checkbox-label-disabled";
            }
        } else if (this.currentlySelected.length < 2) {
            document.getElementById('next').disabled = true;
            for (var notSelected in this.currentlyNotSelected) {
                document.querySelector('label[for="'+ this.currentlyNotSelected[notSelected]+'"]').className = "";
            }
        }
    },
    onClickNext: function() {
        var isLastQuestion = (this.currentQuestionNumber === Think.questions.length - 1);
        if (isLastQuestion) {
            this.addAnswersToArray(this.currentlySelected);
            this.showResults(this.answersArray);
        } else {
            console.log(Think.questions.length - this.currentQuestionNumber + " questions left");
            this.updateQuestionNumber("forward");
            this.showCurrentQuestion();
            document.getElementById('back').disabled = false;
            document.getElementById('next').disabled = true;
            this.addAnswersToArray(this.currentlySelected);        
            this.reset();
        }
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
    addAnswersToArray: function(selected) {
        this.answersArray.push(selected);
        console.log(this.answersArray);
    },
    //render function to take care of HTML view
    showResults: function(resultsArray) {
        if (resultsArray.length === 15) {
            console.log("Successful Test");
        } else {
            console.log("Full Test was Unsuccessful");
        }
        document.getElementById('buttons').innerHTML = this.totalResults();
    },
    totalResults: function() {
        var flatAnswersArray = [].concat.apply([],this.answersArray)
        console.log(flatAnswersArray);
        this.sumArrayTypes(flatAnswersArray);
        return console.log(this.finalResults);
    },
    sumArrayTypes: function(allAnswers) {
        for (var i = 0; i < allAnswers.length; i++) {
            var answer = allAnswers[i].replace(/\d+/, '');
            this.finalResults[answer] = 1 + (this.finalResults[answer] || 0);
        }
    }
});
