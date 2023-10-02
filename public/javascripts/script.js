const chaptersArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];

const left = document.getElementById("leftArrow");
const right = document.getElementById("rightArrow");


async function fetchChapterNumber() {
    await fetch('/chapterNumber')
    .then(response => response.json())
    .then(data => {
        let currentChapter = parseInt(data.chapterNumber);
        left.addEventListener("click", () => {
            toBack();
        })
        
        right.addEventListener("click", () => {
            toNext();
        })
        
        
        function toNext() {
            currentChapter ++;
            if (currentChapter > (chaptersArray.length)) {
                currentChapter = 1;
            } 
            shouldShowButtons();
        }
        
        function toBack() {
            if (currentChapter === 1) {
                currentChapter = 18;
            } else {
                currentChapter --;
            }
            shouldShowButtons();
        }
        
        function shouldShowButtons() {
            if (currentChapter === 1) {
                left.classList.add("hidden")
            } else {
                left.classList.remove("hidden")
            }
        
            if (currentChapter === chaptersArray.length) {
                right.classList.add("hidden")
            } else {
                right.classList.remove("hidden")
            }
        }
        shouldShowButtons();
    })
    .catch(error => {
    console.error('Error:', error);
    });
}

fetchChapterNumber();

