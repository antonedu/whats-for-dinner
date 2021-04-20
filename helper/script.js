var dishes = []
var localStorageActivated;

if (localStorage.getItem("dishes") === null) {
  localStorageActivated = false;
}
else {
  localStorageActivated = true;
  dishes = localStorage.getItem("dishes");
}
