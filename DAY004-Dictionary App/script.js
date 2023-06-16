const url = "https://api.dictionaryapi.dev/api/v2/entries/en/";

const inputText = document.getElementById("input-text");
const searchBtn = document.getElementById("search-btn");
const result = document.getElementById("result");
const resultWord = document.getElementById("word");
const phoneticText = document.getElementById("phonetic");
const detailsBody = document.getElementById("detailsBody");

searchBtn.addEventListener("click", async () => {
  detailsBody.innerHTML = "";
  try {
    const res = await fetch(`${url}${inputText.value}`);
    const resObj = await res.json();

    if (resObj[0] == undefined) {
      document.getElementById("noword").style.display = "block";
    }

    const data = resObj[0];

    console.log(data);

    const { license, meanings, phonetics, sourceUrls, word, phonetic } = data;

    result.style.display = "block";

    resultWord.innerText = word;

    console.log("meanings", meanings);

    meanings.forEach((meaning, index) => {
      const newEl = document.createElement("div");
      var e = `
      <div class="details">
          <p>${meaning.partOfSpeech && meaning.partOfSpeech}</p>
          <p id="phonetic">${phonetic != undefined ? phonetic : ""}</p>
        </div>
       
      `;

      let defElText = "";

      meaning.definitions.forEach((def) => {
        defElText += `<p class="meaning">${def.definition}</p>`;
      });

      let synText = "";

      meaning.synonyms.forEach((syn) => {
        synText += syn + ", ";
      });

      e = e + defElText;

      newEl.innerHTML =
        e +
        `
      <p id="example" class="example">
      <b>synonyms:</b> ${synText}
      </p>`;
      detailsBody.appendChild(newEl);

      if (meaning.synonyms.length > 0) {
        document.getElementById("example").style.display = "block";
      }
    });

    document.getElementById("sound").addEventListener("click", () => {
      document
        .getElementById("audio")
        .setAttribute("src", data.phonetics[0].audio);
      document.getElementById("audio").play();
    });
  } catch (error) {
    console.log(error);
  }
});
