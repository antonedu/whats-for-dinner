function openAndCollapse(element) {
  element.classList.toggle("collapsed")
  element.classList.toggle("not-collapsed")
}

class Dish {
  constructor(name, weekdays, dates, freq) {
    this.name = name;
    this.weekdays = weekdays;
    this.dates = dates;
    this.freq = freq;
  }
}

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
`
