window.Think = window.Think || {}
window.Think = _.extend(window.Think, {
    initialize: function() {
        this.currentQuestionNumber = 0;
        this.answersArray = [];
        this.finalResults = {AS: 0, CS: 0, CR: 0, AR: 0};
        this.count = 0; 
        this.currentlySelected = [];
        this.currentlyNotSelected = [this.currentQuestionNumber + "CS",this.currentQuestionNumber + "AS", this.currentQuestionNumber + "AR", this.currentQuestionNumber + "CR"];
        this.goingBack = 0;
        this.numberOfQuestions = (Think.questions.length - 1);
        this.isFirstQuestion = (this.currentQuestionNumber === 0);
        this.isLastQuestion = (this.currentQuestionNumber === this.numberOfQuestions);
        this.displayProgressBar();
        this.showCurrentQuestion();
        this.initializeListeners();
    },
    renderProgressBarSVG: function(){
        var increment = 18.733;
        var fillColor = "#FF8080";
        var incrementedWidth = (increment * (this.currentQuestionNumber));
        var startSVG = '<svg width="368" height="50" xmlns="http://www.w3.org/2000/svg"><g><title>Progress Bar</title>';
        var isFirstQuestion = (this.currentQuestionNumber === 0);
        if (isFirstQuestion){
            progressFill = '';
        } else {
            progressFill = '<rect stroke="#000000" id="svg_2" height="17.07409" width="'+incrementedWidth+'" y="16.425" x="52.53886" stroke-linecap="null" stroke-linejoin="null" stroke-dasharray="null" stroke-width="0" fill="'+fillColor+'"/>\
            <rect transform="rotate(-90 52.5737 24.8987)" fill="'+fillColor+'" stroke-width="null" stroke-dasharray="null" stroke-linejoin="null" stroke-linecap="null" x="44.53199" ry="5" rx="5" y="21.12343" width="16.08341" height="7.55047" id="svg_4" stroke="'+fillColor+'"/>';
        }
        var progressOutline = '<rect fill="none" stroke="#000000" ry="5" rx="5" x="48" y="16" width="272" height="18" id="svg_1"/>';
        var endSVG = '</g></svg>';
        var progressBarSVG = startSVG + progressFill + progressOutline + endSVG;
        return progressBarSVG;
    },
    displayProgressBar: function(){
        document.getElementById('progress-bar').innerHTML = this.renderProgressBarSVG();
    },
    showCurrentQuestion: function() {
        var question = this.currentQuestion();
        var buttonHtml = "";
        for (var i in question.answers) {
            var answer = question.answers[i];
            var id = this.currentQuestionNumber + answer.category
            buttonHtml = buttonHtml + "<label for='" + id + "'><input type='checkbox' id='" + id + "'class='individual-checkbox' value='" + answer.category + "'>" + answer.name + "</label><br>";
        };
        $('.type-options').html(buttonHtml);
        if (this.currentQuestionNumber === this.numberOfQuestions){
            document.getElementById('next').innerHTML = "Submit";
        }
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
        var isLastQuestion = (this.currentQuestionNumber === this.numberOfQuestions);
        if (isLastQuestion) {
            this.addAnswersToArray(this.currentlySelected);
            this.totalResults();
            this.displayResults(this.answersArray);
        } else {
            this.updateQuestionNumber("forward");
            this.displayProgressBar();
            this.showCurrentQuestion();
            document.getElementById('back').disabled = false;
            document.getElementById('next').disabled = true;
            this.addAnswersToArray(this.currentlySelected);        
            this.reset();
        }
    },
    onClickBack: function() {
        this.updateQuestionNumber("back");
        this.displayProgressBar();
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
    },
    totalResults: function() {
        var flatAnswersArray = [].concat.apply([],this.answersArray)
        this.sumArrayTypes(flatAnswersArray);
        return console.log(this.finalResults);
    },
    sumArrayTypes: function(allAnswers) {
        for (var i = 0; i < allAnswers.length; i++) {
            var answer = allAnswers[i].replace(/\d+/, '');
            this.finalResults[answer] = 1 + (this.finalResults[answer] || 0);
        }
    },
    renderResultsSVG: function(){
        var backgroundWidth = 368;
        var backgroundHeight = 280;
        var centerX = backgroundWidth / 2;
        var centerY = backgroundHeight / 2;
        var increment = 1.78;
        var topCS = this.finalResults["CS"] * 4;
        var rightAS = this.finalResults["AS"] * 4;
        var bottomAR = this.finalResults["AR"] * 4;
        var leftCR = this.finalResults["CR"] * 4;
        var gridSVG = 
            '<rect height="215" width="217" y="32.5" x="75.5" stroke-width="2" fill="none" stroke="#000000"/>\
            <line y2="32.68382" x2="184" y1="247.31618" x1="184" stroke-linecap="null" stroke-linejoin="null" stroke-dasharray="null" fill="none" stroke="#000000"/>\
            <line y2="140" x2="292.27206" y1="140" x1="75.72794" stroke-linecap="null" stroke-linejoin="null" stroke-dasharray="null" fill="none" stroke="#000000"/>\
            <text fill="#000000" stroke="#000000" stroke-width="0" stroke-dasharray="null" stroke-linejoin="null" stroke-linecap="null" x="44.93331" y="150.39252" font-size="12" font-family="Sans-serif" text-anchor="middle" xml:space="preserve">Random</text>\
            <text fill="#000000" stroke="#000000" stroke-width="0" stroke-dasharray="null" stroke-linejoin="null" stroke-linecap="null" x="45.24408" y="138.47664" font-size="12" font-family="Sans-serif" text-anchor="middle" xml:space="preserve">Concrete</text>\
            <text fill="#000000" stroke="#000000" stroke-width="0" stroke-dasharray="null" stroke-linejoin="null" stroke-linecap="null" x="184.0014" y="26.542060" font-size="12" font-family="Sans-serif" text-anchor="middle" xml:space="preserve">Concrete Sequential</text>\
            <text fill="#000000" stroke="#000000" stroke-width="0" stroke-dasharray="null" stroke-linejoin="null" stroke-linecap="null" x="326.6732" y="138.69159" font-size="12" font-family="Sans-serif" text-anchor="middle" xml:space="preserve">Abstract</text>\
            <text fill="#000000" stroke="#000000" stroke-width="0" stroke-dasharray="null" stroke-linejoin="null" stroke-linecap="null" x="326.6741" y="150.84113" font-size="12" font-family="Sans-serif" text-anchor="middle" xml:space="preserve">Sequential</text>\
            <text fill="#000000" stroke="#000000" stroke-width="0" stroke-dasharray="null" stroke-linejoin="null" stroke-linecap="null" x="183.9995" y="263.30219" font-size="12" font-family="Sans-serif" text-anchor="middle" xml:space="preserve">Abstract Random</text>';
        var diamondSVG = 
            '<polygon fill="red" stroke="black" opacity="0.5" points="\
            '+centerX+','+(centerY + (increment * topCS))+' \
            '+(centerX + (increment * rightAS))+','+centerY+' \
            '+centerX+','+(centerY - (increment * bottomAR))+' \
            '+(centerX - (increment * leftCR))+','+centerY+'"';
        var gridAndDiamondSVG = 
            '<svg width="'+backgroundWidth+'" height="'+backgroundHeight+'">\
                <g>\
                    <title>Graph</title>\
                    '+gridSVG+'\
                </g>\
                <g>\
                    <title>Diamond</title>\
                    '+diamondSVG+'\
                </g>\
            </svg>';
        return gridAndDiamondSVG;
    },
    displayResults: function(resultsArray) {
        document.getElementById('test-instructions').innerHTML = "Results";
        document.getElementById('progress-bar').style.display = 'none';
        document.getElementById('type-options').style.display = 'none';
        document.getElementById('navigation').innerHTML = '';
        document.getElementById('results').style.display = 'block';
        document.getElementById('results').innerHTML = this.renderResultsSVG();
        document.getElementById('share').style.display = 'block';
    }
});








