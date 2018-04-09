//Arrays of all icons
const cardList = ['diamond', 'diamond', 'paper-plane-o', 'paper-plane-o', 'anchor', 'anchor', 'bolt', 'bolt', 'cube', 'cube', 'leaf', 'leaf', 'bicycle', 'bicycle', 'bomb', 'bomb'];
//cards Container
let cards = [];
//Track number of matching
let matching = 0;
//Track the movement
let moveCount = 0;
//for timer
let countDown;
//Number of stars, starting with 3 stars
let stars = 3;


/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

/* 
 * start the game by shuffling the cards randomly and call open to open one card at a time
 * In addition, call reset functions to active the reset button and timer to star counting down
 */
function start() {
    arrange(cardList);
    //Hide the modal when start
    $("#popup").hide();
    open();
    timer();
    //Restart Button
    $('.restart').on('click', function() {
        restart();
    });

}

/* Create a li in DOM under deck list after shuffling */
let arrange = function(list) {
    let shuf = shuffle(list);
    for (let i = 0; i < shuf.length; i++) {
        $(".deck").append($('<li class="card"><i class="fa fa-' + shuf[i] + '"></i></li>'));
    }
}

/* 
 * Restart the game, so the board should be shaffled and 
 * reset the timer and moving counter
 */
let restart = function() {
    //Empty the list
    $('.deck').empty();
    cards = [];
    //Re-shuffle
    arrange(cardList);
    //Reset the move numbers and stars
    $('.moves').text(0);
    moveCount = 0; //update 
    //Return the 3 stars
    let j = 2;
    while (j >= 0) {
        $('.stars').children()[j].remove();
        $('.stars').append('<li><i class="fa fa-star"></i></li>');
        j--;
    }
    //reset matching, timer and call open() function
    matching = 0;
    //set tiem to 0 (clear Interval)
    clearInterval(countDown);
    timer();
    open();
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol 
 *  - add the card to a *list* of "open" cards 
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position 
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol 
 *    + increment the move counter and display it on the page 
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
let open = function() {
    $('.deck .card').on('click', function() {
        let isDisplayed = display($(this)); //Try to open the card
        //If the card has not been opened before or mtached, it will open, otherwise no!
        if (!isDisplayed) {
            let opened = openedCard($(this));
            if (opened.length == 2) {
                //Increase the move counter
                move();
                //Return [object object]
                if (opened[0][0].firstChild.className == opened[1][0].firstChild.className) {
                    //Check the matching
                    match(opened[0], opened[1]);
                } else {
                    //shake left when they are not matching
                    $(opened[0]).shake();
                    $(opened[1]).shake();
                    //then remove the elements by calling remove() function
                    setTimeout(function() {
                        remove(opened[0], opened[1]);
                    }, 300); //Wait sometime before removing
                }
            }
        }
    });
}

/* display the card's symbol if and only if it is not open or matched */
let display = function(e) {
    //disable the click when the card is opened or matched
    if ($(e).hasClass('show') || $(e).hasClass('match')) {
        return true;
    } else {
        $(e).addClass("show open");
        return false;
    }

}

/* add the card to a *list* of "open" cards, to track the 2 open cards */
let openedCard = function(e) {
    cards.push(e);
    return cards;
}

/* lock the cards in the open position, change the card's color and animate the cards */
let match = function(first, second) {
    first.addClass('match');
    second.addClass('match');
    //shake up when they are matching
    $(first).shake({
        direction: "up",
        distance: 50
    });
    $(second).shake({
        direction: "up",
        distance: 50
    });
    matching++;
    //empty the container
    cards = [];
    //When all cards are matched
    if (matching === 8) {
        //set tiem to 0 (clear Interval)
        clearInterval(countDown);
        //Check how many starts are there, to be displayed in win modal
        let starList = '<ul class="list">';
        for (let i = 0; i < stars; i++) {
            starList += '<li><i class=\"fa fa-star\"></i></li>';
        }
        starList += '</ul>'
        //check the timer
        let winningTime = $('.countDown').text();
        //show the win daialog
        let winModal = "<div class=\"modalInfo\"><div class=\"playAgain\"><p><strong>CONGRATULATIONS !!!</strong>You took <strong>" + winningTime + "</strong> seconds to win.<br> You Have collected the following stars: " + starList + "<br> Do you want to play again?</p><button id=\"restart\">Restart Game</button></div></div>";
        viewModal(winModal); //for viwing modal
    }
}

/* remove the cards from the cards container when the 2 cards are not equal */
let remove = function(first, second) {
    first.removeClass("show open");
    second.removeClass("show open");
    cards = [];
}

/* increment the move counter and display it on the page */
let move = function() {
    moveCount++;
    $('.moves').text(moveCount);
    if (moveCount === 14) {
        $('.stars').children()[0].remove();
        $('.stars').append('<li><i class="fa fa-star-o"></i></li>');
        stars--; //decrease start by 1
    } else if (moveCount === 22) {
        $('.stars').children()[1].remove();
        $('.stars').append('<li><i class="fa fa-star-o"></i></li>');
        stars--; //decrease start by 1
    }
}

/* Timer function to cound down, it starts from 61 until 0 */
let timer = function() {
    let timeleft = 61;
    countDown = setInterval(function() {
        timeleft--;
        $(".countDown").text(timeleft);
        if (timeleft <= 0) {
            clearInterval(countDown);
            //show the gameOver daialog
            let gameOver = "<div class=\"modalInfo\"><div class=\"playAgain\"><p><strong>OoPS GAME OVER!!!</strong> <br> Do you want to try again?</p><button id=\"restart\">Restart Game</button></div></div>";
            viewModal(gameOver); //for viwing modal
        }
    }, 1000);
}

/* Informaiton for restart butotn in modalview for both GameOver and Winning */
let viewModal = function(elements) {
    //show the info daialog
    $("#popup").append(elements);
    $("#popup").show();
    //Restart the game if the user click on resart button
    $("#restart").on('click', function() {
        $("#popup").hide();
        $("#popup").empty();
        restart();
    });
}