const dictionary = document.querySelector(".dictionary")
const searchInput = dictionary.querySelector("input")
const info = dictionary.querySelector(".info")
const removeIcon = dictionary.querySelector(".search span");

    function data(result, word) {
        if (result.title) {
            info.innerHTML = `Can't find the meaning of <span>"${word}"</span>. Please, try to search for another word.`;
        } else {
            dictionary.classList.add("active");
            let definitions = result[0].meanings[0].definitions[0],
                partOfSpeech = result[0].meanings[0].partOfSpeech,
                phoneticText = result[0].phonetics[0] ? result[0].phonetics[0].text : "N/A"; 
            document.querySelector(".word p").innerText = result[0].word;
            document.querySelector(".word span").innerText = `${partOfSpeech}  /${phoneticText}/`;
            document.querySelector(".meaning span").innerText = definitions.definition;
        }
    }
    
function search(word) {
    fetchApi(word);
    searchInput.value = word;
}
function fetchApi(word) {
    dictionary.classList.remove("active");
    info.style.color = "#000";
    info.innerHTML = `Searching the meaning of <span>"${word}"</span>`;
    let url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(result => data(result, word))
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
            if (error.message === 'Network response was not ok') {
                info.innerHTML = `Can't find the meaning of <span>"${word}"</span>. Please, try to search for another word.`;
            } else {
                info.innerHTML = `There was a problem with the fetch operation. Please try again.`;
            }
        });
}
document.getElementById("btn").addEventListener("click", () => {
    let word = searchInput.value.trim(); 
    if (isValidWord(word)) {
        fetchApi(word);
    } else {
        info.innerHTML = `Invalid input. Please enter a word containing only alphabets.`;
    }
});
searchInput.addEventListener("keyup", e => {
    let word = e.target.value.trim(); 
    if (e.key == "Enter" && isValidWord(word)) {
        fetchApi(word);
    } else if (!isValidWord(word)) {
        info.innerHTML = `Invalid input. Please enter a word containing only alphabets.`;
    }
});
function isValidWord(word) {
    return /^[a-zA-Z]+$/.test(word);
}
removeIcon.addEventListener("click", () => {
    searchInput.value = "";
    searchInput.focus();
    dictionary.classList.remove("active");
    info.style.color = "#9A9A9A";
    info.innerHTML = "Type any existing word or phrase.";
});
