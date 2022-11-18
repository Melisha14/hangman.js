
        var Hangman = function(elem) {
            
            var alphabet = "abcdefghijklmnopqrstuvwxyz",

        request,
        word = "liverpool",
        word_list = ["liverpool", "enfant", "crocodile", "logiciel", "acajou", "faucon", "javascript", 
                    "togo", "melissa"],
        word_length,
        letters_guessed = [],
        
        displayed_word,
        vies = 6,
        game_complete = false;
                

            var top_display = quickCreateElement("div", "top-display"),     
                DOM_displayed_word = quickCreateElement("div", "displayed-word"),
                DOM_vies = quickCreateElement("div", "vies"),
                DOM_game_message = quickCreateElement("div", "message"),
                buttons_section = quickCreateElement("div", "buttons-section"),

                letter_buttons = [];    
                
            for (var i=0; i<26; i++) {
                letter_buttons.push(quickCreateElement("button", "letter-button", alphabet[i]));
            }
            
            top_display.appendChild(DOM_displayed_word);
            top_display.appendChild(DOM_vies);
            top_display.appendChild(DOM_game_message);
            
            for (var i = 0; i < 26; i++) {
                buttons_section.appendChild(letter_buttons[i]);
            }
            
            
            function quickCreateElement(type, cls, id) {
                var ret = document.createElement(type);
                if (cls) { ret.classList.add(cls); }
                if (id) { ret.id = id; }
                return ret
            }
                
            function contains(arr, el) {

                for (var i = 0; i < arr.length; i++) {
                    if (arr[i] == el) { return true }
                }
                return false
            };
          
            
            function reset () {
                while(elem.lastChild) {
                    elem.removeChild(elem.firstChild);
                }
            };
            
            function getWord() {
                request = new XMLHttpRequest;
                request.open('GET', 'https://crossorigin.me/http://randomword.setgetgo.com/get.php');
                request.onload = function() {
                    if (request.status == 200){     
                        word = request.response.toLowerCase();
                        loadInitialDOM();
                        render();   
                    }

                };
                request.onerror = function() {
                    console.log('connection error');
                };
                request.send();     
            };
            
            function getWordNoAPI () {
                word = word_list[Math.floor(Math.random() * word_list.length)];
                loadInitialDOM();
                render();   
            };
            
            function loadInitialDOM() {    
                elem.appendChild(top_display);
                elem.appendChild(buttons_section);
            };
          
            function render() {
                renderDisplayedWord();
                DOM_vies.innerHTML = "vies restantes: " + vies;
                evaluateResult();
                if (game_complete) {
                    DOM_game_message.innerHTML = game_complete;
                }
                renderButtons(game_complete);
            };
          
            function renderDisplayedWord() {
                displayed_word = "";
                for (var i = 0; i < word.length; i++) {
                    if (contains(letters_guessed, word[i])) {
                        displayed_word += word[i];
                    }
                    else {
                        displayed_word += "_";
                    }
                    displayed_word += (i == word.length) ? "" : " " ;
                }
                DOM_displayed_word.innerHTML = displayed_word;
            };
            
            function evaluateResult() {
                if (!contains(displayed_word, "_")) {
                    game_complete = "Bravoo!!! Bien joué ; Tu as trouvé le mot: " + word 
                }
                if (vies <= 0) {
                    game_complete = "Dommage, c'est raté! <br />Le bon mot est:" + word 
                }
            };
          
            function renderButtons(game_over) {
                for (var i = 0; i < 26; i++) {
                    b = letter_buttons[i];
                    b.innerHTML = "";
                    b.removeEventListener("click", letter_select);
                    b.innerHTML = alphabet[i];
                    if (!game_over && !contains(letters_guessed, alphabet[i])) {
                        b.addEventListener("click", letter_select);
                    }
                    else {
                        b.classList.add("deactivated");
                    }
                }
            };
          
            function letter_select() {
                var letter = event.target.id;

                letters_guessed.push(letter);
                if (!contains(word, letter)) {
                    vies -= 1;
                }
                render();
            };
          
            reset();

            getWordNoAPI(); 
          
          };
          
          document.addEventListener('DOMContentLoaded', function() {
          
            var new_game_button = document.getElementById("new-game-button")
                hangman_div = document.getElementById("hangman");
                
            new_game_button.addEventListener("click", function() {
                new Hangman(hangman_div);
            });
          });
          
          