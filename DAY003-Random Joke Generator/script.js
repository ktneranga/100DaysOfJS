const jokeContainer = document.getElementById("joke");

const jokeHandler = async () => {
  getJoke();
};

const getJoke = async () => {
  jokeContainer.classList.remove("fade");
  try {
    const response = await fetch(
      "https://v2.jokeapi.dev/joke/Programming,Miscellaneous,Dark,Pun,Spooky?blacklistFlags=religious&type=single"
    );
    const joke = await response.json();
    jokeContainer.innerHTML = joke.joke;
    jokeContainer.classList.add("fade");
  } catch (error) {
    console.log(error);
  }
};

getJoke();
