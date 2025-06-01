import arrUp from "../img/arrow_up.svg";
import arrDown from "../img/arrow_down.svg";

function sort() {
    const place = document.querySelector(".main__load");
    document.querySelector(".id_sort").parentNode.addEventListener('click', e => {
      const arr = [...document.getElementsByClassName("contact")];
      const element = document.querySelector(".id_sort");
      if (element.src == "" || element.dataset.state == "up") {
        element.dataset.state = "down";
        element.src = arrDown;
        arr.sort((a, b) => a.childNodes[1].textContent - b.childNodes[1].textContent)
      } else {
        element.dataset.state = "up";
        element.src = arrUp;
        arr.sort((a, b) => b.childNodes[1].textContent - a.childNodes[1].textContent)
      }
      document.querySelectorAll(".contact").forEach(e => {e.remove();})
      arr.forEach(el => {place.appendChild(el)});
    })

    document.querySelector(".fio_sort").parentNode.addEventListener('click', e => {
      const arr = [...document.getElementsByClassName("contact")];
      const element = document.querySelector(".fio_sort");
      if (element.src == "" || element.dataset.state == "up") {
        element.dataset.state = "down";
        element.src = arrDown;
        document.querySelector(".fio_sort_p").textContent = "А-Я"
        arr.sort((a, b) => a.childNodes[3].textContent.localeCompare(b.childNodes[3].textContent));
      } else {
        element.dataset.state = "up";
        element.src = arrUp;
        document.querySelector(".fio_sort_p").textContent = "Я-А"
        arr.sort((a, b) => b.childNodes[3].textContent.localeCompare(a.childNodes[3].textContent));
      }
      document.querySelectorAll(".contact").forEach(e => {e.remove();})
      arr.forEach(el => {place.appendChild(el)});
    })

    document.querySelector(".create_sort").parentNode.addEventListener('click', e => {
      const arr = [...document.getElementsByClassName("contact")];
      const element = document.querySelector(".create_sort");
      if (element.src == "" || element.dataset.state == "up") {
        element.dataset.state = "down";
        element.src = arrDown;
        arr.sort((a, b) => Date.parse(a.childNodes[5].dataset.time) - Date.parse(b.childNodes[5].dataset.time))
      } else {
        element.dataset.state = "up";
        element.src = arrUp;
        arr.sort((a, b) => Date.parse(b.childNodes[5].dataset.time) - Date.parse(a.childNodes[5].dataset.time))
      }
      document.querySelectorAll(".contact").forEach(e => {e.remove();})
      arr.forEach(el => {place.appendChild(el)});
    })

    document.querySelector(".edit_sort").parentNode.addEventListener('click', e => {
      const arr = [...document.getElementsByClassName("contact")];
      const element = document.querySelector(".edit_sort");
      if (element.src == "" || element.dataset.state == "up") {
        element.dataset.state = "down";
        element.src = arrDown;
        arr.sort((a, b) => Date.parse(a.childNodes[7].dataset.time) - Date.parse(b.childNodes[7].dataset.time))
      } else {
        element.dataset.state = "up";
        element.src = arrUp;
        arr.sort((a, b) => Date.parse(b.childNodes[7].dataset.time) - Date.parse(a.childNodes[7].dataset.time))
      }
      document.querySelectorAll(".contact").forEach(e => {e.remove();})
      arr.forEach(el => {place.appendChild(el)});
    })
  }
  export {sort}