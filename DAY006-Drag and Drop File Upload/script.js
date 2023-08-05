let uploadButton = document.getElementById("upload-button");
let chosenImage = document.getElementById("chosen-image");
let imageDisplay = document.getElementById("imageDisplay");
let errorMs = document.getElementById("error");
let container = document.querySelector(".container");

const fileHandler = (file, type, name) => {
  //first check the type
  if (type.split("/")[0] !== "image") {
    errorMs.innerText = "Please upload an image file";
    return false;
  }

  //to read the file object
  const reader = new FileReader();

  //read content of the file
  reader.readAsDataURL(file);
  //when file read event is completed
  reader.onloadend = () => {
    //create a figure tag
    let figure = document.createElement("figure");
    let img = document.createElement("img");
    img.src = reader.result;
    figure.appendChild(img);
    figure.innerHTML += `<figcaption>${name}</figcaption>`;
    imageDisplay.appendChild(figure);
  };

  errorMs.innerText = "";
};

//upload file button
uploadButton.addEventListener("change", () => {
  console.log(Array.from(uploadButton.files));
  Array.from(uploadButton.files).map((file) => {
    fileHandler(file, file.type, file.name);
  });
});

//drag animations

container.addEventListener(
  "dragenter",
  (e) => {
    e.preventDefault();
    e.stopPropagation();
    container.classList.add("active");
  },
  false
);

container.addEventListener(
  "dragleave",
  (e) => {
    e.preventDefault();
    e.stopPropagation();
    container.classList.remove("active");
  },
  false
);

container.addEventListener(
  "dragover",
  (e) => {
    e.preventDefault();
    e.stopPropagation();
    container.classList.add("active");
  },
  false
);

container.addEventListener(
  "drop",
  (e) => {
    e.preventDefault();
    e.stopPropagation();
    container.classList.remove("active");

    let draggedData = e.dataTransfer;
    let files = draggedData.files;
    imageDisplay.innerHTML = "";
    Array.from(files).map((file) => fileHandler(file, file.type, file.name));
  },
  false
);

window.onload = () => {
  errorMs.innerText = "";
};
