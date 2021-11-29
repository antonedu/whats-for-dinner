const outputItemTemplate = `
<div id="output-items">
  <div class="output-item collapsed">
    <p>${name}</p>
    <button class="collapse" onclick="openAndCollapse(document.querySelectorAll('#output-items .output-item')[0])"><i class="fas fa-chevron-down"></i></button>
    <div class="output-info">
      <p>Frequency: ${freq}</p>
      <p>Weekdays: ${weekdays}</p>
    </div>
    <div class="output-button-wrapper">
      <button class="red threed-button">
        Remove
      </button>
    </div>
  </div>
</div>
`;

class Dish {
  constructor(name, weekdays, dates, freq) {
    this.name = name;
    this.weekdays = weekdays;
    this.dates = dates;
    this.freq = freq;
  };

  get weekdaysStr() {
    let weekdaysStr = "";
    let weekdaysArray = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
    if (this.weekdays == 0) {
      return "all"
    };
    for (let i = 0; i++; i < 7) {
      if (this.weekdays[i] == true) {
        if (weekdaysStr.length == 0) {
          weekdaysStr += weekdaysArray[i];
        } else {
          weekdaysStr += ", " + weekdaysArray[i];
        };
      };
    };
  };
};

function openAndCollapse(element) {
  element.classList.toggle("collapsed");
  element.classList.toggle("not-collapsed");
};
