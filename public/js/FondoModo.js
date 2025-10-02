const d = document;
const checkbox = d.getElementById("checkbox");

let darkModeState = false;

const useDark = window.matchMedia("(prefers-color-scheme: dark)"); 

function toggleDarkMode(state) {
    d.documentElement.classList.toggle("dark-mode", state); 
    darkModeState = state;
}

function setDarkModeLocalStorage(state) {
    localStorage.setItem("darkMode", state);

}

toogleDarkMode(useDark.matches);
toggleDarkMode(localStorage.getItem("dark-mode") == "true");

useDark.addListener((event)=> toogleDarkMode(event.matches));

checkbox.addEventListener("change", () => {
    darkModeState = !darkModeState;
    toggleDarkMode(darkModeState);
    setDarkModeLocalStorage(darkModeState); 
})