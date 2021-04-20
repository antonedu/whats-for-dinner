function toggleFooter() {
  let element = document.getElementsByTagName("footer")[0];
  element.classList.toggle("hide");
}

window.addEventListener('mousewheel', function(e){
    let element = document.getElementsByTagName("footer")[0];
    let wDelta = e.wheelDelta < 0 ? 'down' : 'up';
    if (wDelta === 'down') {
      element.classList.remove("hide");
    }
    else {
      element.classList.add("hide");
    }
});
