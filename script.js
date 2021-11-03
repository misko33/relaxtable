var questions = [
{question:"Kako se zovete?"},
{question:"Kako se prezivate?"},
{question:"Koja je Vaša email adresa?", pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/},
{question:"Koji je Vaš broj mobitela?", pattern: /([0-9\s\-]{7,})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?$/},
{question:"Odaberite željeni termin."}
]

document.addEventListener("keypress", function(event) {
    if (document.activeElement !== inputField && event.keyCode != 13) {
        inputField.value = event.key
        inputField.focus()
    }
});

function funcLoad(){
    if (window.matchMedia("(max-width: 601px)").matches){
        console.log("tu")
        imgMasaza.style.top = window.innerHeight - 100 + 'px';
    }
}

const url = "https://docs.google.com/spreadsheets/d/1dVug_FnHmIrpI9rDUQiRBhx85HIuduwdoCH9WWnLS3c/export?format=csv"
fetch(url).then(result=>result.text()).then(function(csvtext){
    var myListOfArrays = [];
    var myArr = csvtext.split("\n");
    var provjera = true;
    var provjera2 = 0;
    var containerInnerHtml3 = '';
    var containerInnerHtml = '<select id="datum" name="datum">';
    for (let i = 0; i < myArr.length; i++){
        provjera = true;
        var myArr2 = myArr[i].split(",");
        myListOfArrays.push(myArr2);
        
        var containerInnerHtml2 = '<select id="vrijeme" name="vrijeme">';
        for (let j = 1; j < myArr2.length; j++){
            if (myArr2[j].trim() != '') containerInnerHtml2 += '<option value='+myArr2[j]+'>'+myArr2[j]+'</option>'
            if (j == myArr2.length - 1 && containerInnerHtml2 == '<select id="vrijeme" name="vrijeme">') {
                provjera = false;
            }
        }
        containerInnerHtml2 += '</select>';
        if (provjera && provjera2 == 0) {
            containerInnerHtml3 = containerInnerHtml2;
            provjera2 += 1;
        }

        if (provjera) containerInnerHtml += '<option value='+myArr2[0]+'>'+myArr2[0]+'</option>';
    }
    containerInnerHtml += '</select>';
    inputSelect.innerHTML = containerInnerHtml;
    inputSelect.innerHTML += containerInnerHtml3;
});

/*
do something after the questions have been answered
*/
var onComplete = function() {

    var h1 = document.createElement('h1')
    h1.appendChild(document.createTextNode('Hvala Vam na rezervaciji termina!'))

    var settings = {
        'cache': false,
        'dataType': "jsonp",
        "async": true,
        "crossDomain": true,
        "url": "https://docs.google.com/forms/d/e/1FAIpQLSdJrhKh825Mviz25BdBqd7XEwk9glDEh-5-1FsqoJMgON-xmQ/formResponse?entry.1884265043=" +questions[0].answer+ "&entry.115339543=" +questions[1].answer+ "&entry.455896985=" +questions[3].answer+ "&entry.1823717513=" +questions[2].answer + "&entry.1141477420=" + vrijeme.value + ", " + datum.value + "&submit=Submit",
        "method": "GET",
        "headers": {
            "accept": "application/json",
            "Access-Control-Allow-Origin":"*"
        }
    }

    $.ajax(settings).done(function (response) {
        console.log(response);
    });

    setTimeout(function() {
    register.parentElement.appendChild(h1)
    setTimeout(function() { h1.style.opacity = 1 }, 50)
    }, 1000)
}

;(function(questions, onComplete) {

    var tTime = 100 // transition transform time from #register in ms
    var wTime = 200 // transition width time from #register in ms
    var eTime = 1000 // transition width time from inputLabel in ms

    // init
    // --------------
    if (questions.length == 0) return

    var position = 0

    putQuestion()

    forwardButton.addEventListener('click', validate)
    inputField.addEventListener('keyup', function(e) {
        transform(0, 0) // ie hack to redraw
        if (e.keyCode == 13 && position != 4) validate()
    })

    previousButton.addEventListener('click', function(e) {
        if (position === 0) return
        position -= 1
        hideCurrent(putQuestion)
    })


    // functions
    // --------------

    // load the next question
    function putQuestion() {
        if (position == 4){
            const url = "https://docs.google.com/spreadsheets/d/1dVug_FnHmIrpI9rDUQiRBhx85HIuduwdoCH9WWnLS3c/export?format=csv"
            fetch(url).then(result=>result.text()).then(function(csvtext){
                var myListOfArrays = [];
                var myArr = csvtext.split("\n");
                for (let i = 0; i < myArr.length; i++){
                    var myArr2 = myArr[i].split(",");
                    myListOfArrays.push(myArr2);
                }

                datum.addEventListener('change', (event) => {
                    for (let i = 0; i < myArr.length; i++){
                        if (myListOfArrays[i][0] == event.target.value){
                            var containerInnerHtml3 = '';
                            for (let j = 1; j < myListOfArrays[i].length; j++){
                                if (myListOfArrays[i][j].trim() != '') containerInnerHtml3 += '<option value='+myListOfArrays[i][j]+'>'+myListOfArrays[i][j]+'</option>'
                            }
                            vrijeme.innerHTML = containerInnerHtml3;
                        }
                    }
                });
    
                inputField.style.display = "none";
                inputLabel.style.display = "none";
                selectLabel.style = "position: absolute; top: 7px; left: 42px; margin-left: 0!important; font-size: 16px; font-weight: normal; color: #000; display: block";
                selectLabel.innerHTML = questions[position].question;
                inputProgress.style.display = "none";
                inputSelect.style.display = "block";
                progress.style.width = position * 100 / questions.length + '%'
                
                showCurrent()
            });

        }
        else {
            selectLabel.style.display = "none";
            inputSelect.style.display = "none";
            inputLabel.innerHTML = questions[position].question
            inputField.style.display = "block";
            inputLabel.style.display = "block";
            inputField.type = questions[position].type || 'text'
            inputField.value = questions[position].answer || ''
            inputField.blur()

            // set the progress of the background
            inputProgress.style.display = "block";
            progress.style.width = position * 100 / questions.length + '%'

            previousButton.className = position ? 'ion-android-arrow-back' : 'ion-person'

            showCurrent()
        }
    }

    // when submitting the current question
    function validate() {

        var validateCore = function() {      
        return inputField.value.match(questions[position].pattern || /.+/)
        }

        if (!questions[position].validate) questions[position].validate = validateCore

        // check if the pattern matches
        if (!questions[position].validate()) wrong(inputField.focus.bind(inputField))
        else ok(function() {

            // execute the custom end function or the default value set
            if (questions[position].done) questions[position].done()
            else questions[position].answer = inputField.value

            ++position

            // if there is a new question, hide current and load next
            if (questions[position]) hideCurrent(putQuestion)
            else hideCurrent(function() {
                // remove the box if there is no next question
                register.className = 'close'
                progress.style.width = '100%'

                onComplete()
            
            })

        })

    }


    // helper
    // --------------

    function hideCurrent(callback) {
        inputContainer.style.opacity = 0
        inputLabel.style.marginLeft = 0
        inputProgress.style.width = 0
        inputProgress.style.transition = 'none'
        inputContainer.style.border = null
        setTimeout(callback, wTime)
    }

    function showCurrent(callback) {
        inputContainer.style.opacity = 1
        inputProgress.style.transition = ''
        inputProgress.style.width = '100%'
        setTimeout(callback, wTime)
    }

    function transform(x, y) {
        register.style.transform = 'translate(' + x + 'px ,  ' + y + 'px)'
    }

    function ok(callback) {
        register.className = ''
        setTimeout(transform, tTime * 0, 0, 10)
        setTimeout(transform, tTime * 1, 0, 0)
        setTimeout(callback, tTime * 2)
    }

    function wrong(callback) {
        register.className = 'wrong'
        for (var i = 0; i < 6; i++) // shaking motion
            setTimeout(transform, tTime * i, (i % 2 * 2 - 1) * 20, 0)
        setTimeout(transform, tTime * 6, 0, 0)
        setTimeout(callback, tTime * 7)
    }

}(questions, onComplete))