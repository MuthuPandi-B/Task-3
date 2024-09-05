document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.card');
    let hasFlippedCard = false;
    let firstCard = null, secondCard = null;
    let lockBoard = false;
    let score = 0;
    let matches = 0;
    let time = 0;
    let timerInterval = null;

    function startTimer() {
        timerInterval = setInterval(() => {
            time++;
            document.getElementById('timer').textContent = `Time: ${time}s`;
        }, 1000);
    }

    function stopTimer() {
        clearInterval(timerInterval);
        timerInterval = null;
    }

    function flipCard() {
        if (lockBoard) return;
        if (this === firstCard) return;

        this.classList.add('flip');

        if (!hasFlippedCard) {
            hasFlippedCard = true;
            firstCard = this;

            if (!timerInterval) {
                startTimer();  // Start the timer on the first card flip
            }
            return;
        }

        secondCard = this;
        checkForMatch();
    }

    function checkForMatch() {
        if (!firstCard || !secondCard) return; // Ensure cards are not null
    
        let isMatch = firstCard.dataset.name === secondCard.dataset.name;
        if (isMatch) {
            disableCards();
            score += 10;
            matches++;
            document.getElementById('score').textContent = `Score: ${score}`;
            
            if (matches === 8) { // All pairs matched
                stopTimer();
                setTimeout(() => {
                    alert(`Congratulations! You won in ${time} seconds with a score of ${score}!`);
                    
                    // Unflip all cards and reset the game
                    cards.forEach(card => {
                        card.classList.remove('flip');
                        card.addEventListener('click', flipCard); // Make cards clickable again
                    });
    
                    // Reset the score, matches, and time for the next round
                    score = 0;
                    matches = 0;
                    time = 0;
    
                    document.getElementById('score').textContent = `Score: ${score}`;
                    document.getElementById('timer').textContent = `Time: ${time}s`;
    
                    resetBoard(); // Reset the board
                    shuffle(); // Shuffle for a new round
                }, 500); // Delay for alert and reset
            }
        } else {
            unflipCards();
        }
    }
    

    function disableCards() {
        if (firstCard && secondCard) { // Ensure cards are not null
            firstCard.removeEventListener('click', flipCard);
            secondCard.removeEventListener('click', flipCard);
        }
        resetBoard();
    }

    function unflipCards() {
        lockBoard = true;
        setTimeout(() => {
            if (firstCard && secondCard) { // Ensure cards are not null
                firstCard.classList.remove('flip');
                secondCard.classList.remove('flip');
            }
            resetBoard();
        }, 1000);
    }

    function resetBoard() {
        [hasFlippedCard, lockBoard] = [false, false];
        [firstCard, secondCard] = [null, null];
    }

    function shuffle() {
        cards.forEach(card => {
            let randomPos = Math.floor(Math.random() * 16);
            card.style.order = randomPos;
        });
    }

    cards.forEach(card => card.addEventListener('click', flipCard));

    function restartGame() {
        cards.forEach(card => {
            card.classList.remove('flip');
            card.addEventListener('click', flipCard);
        });

        score = 0;
        matches = 0;
        time = 0;
        document.getElementById('score').textContent = `Score: ${score}`;
        document.getElementById('timer').textContent = `Time: ${time}s`;

        stopTimer(); 
        resetBoard(); 
        shuffle(); 
    }

    document.getElementById('Restart').addEventListener('click', restartGame);
    resetBoard();
    shuffle();// Call shuffle during initial setup
});
