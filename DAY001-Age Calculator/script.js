const monthsArray = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

const calculateAge = () => {
  const today = new Date();
  const inputDate = new Date(document.getElementById("date-input").value);

  let birthDetails = {
    year: inputDate.getFullYear(),
    month: inputDate.getMonth() + 1,
    date: inputDate.getDate(),
  };

  let currentYear = today.getFullYear();
  let currentMonth = today.getMonth() + 1;
  let currentDate = today.getDate();

  checkLeapYear(currentYear);

  if (
    birthDetails.year > currentYear ||
    (birthDetails.year == currentYear && birthDetails.month > currentMonth) ||
    (birthDetails.year == currentYear &&
      birthDetails.month == currentMonth &&
      birthDetails.date > currentDate)
  ) {
    displayOutput("-", "-", "-");
    return alert("Not born yet");
  }

  let years = currentYear - birthDetails.year;

  let months;

  if (currentMonth >= birthDetails.month) {
    months = currentMonth - birthDetails.month;
  } else {
    years--;
    months = 12 + currentMonth - birthDetails.month;
  }

  let dates;

  if (currentDate >= birthDetails.date) {
    dates = currentDate - birthDetails.date;
  } else {
    let daysInPreviousMonth = monthsArray[currentMonth - 2];
    dates = daysInPreviousMonth + currentDate - birthDetails.date;
    months--;
    if (months < 0) {
      months = 11;
      years--;
    }
  }
  displayOutput(years, months, dates);
};

function displayOutput(years, months, dates) {
  document.getElementById("years").innerText = years;
  document.getElementById("months").innerText = months;
  document.getElementById("days").innerText = dates;
}

//leap year
function checkLeapYear(year) {
  if (year % 4 == 0 && (year % 100 != 0 || year % 400 == 0)) {
    monthsArray[1] = 29;
  } else {
    monthsArray[1] = 28;
  }
  console.log(year, monthsArray[1]);
}
