import "./css/style.css";
import "./css/media.css";
import { sort } from "./src/sort.js";
import logo from "./img/logo.png";
import addContSvg from "./img/create.svg";
import cancelContSvg from "./img/cancel.svg";

document.querySelector('.header__img').src = logo;

let globalContacts = [];
function getDate(str) {
  str = str.split("T")[0];
  let newStr = `${str.slice(-2)}.${str.slice(5, 7)}.${str.slice(0, 4)}`;
  return newStr;
}
function getTime(str) {
  str = str.split("T")[1];
  let newStr = `${str.slice(0, 5)}`;
  return newStr;
}
function moreInfo(e, dop) {
  if (dop == true) return `${e.target.dataset.value}`;
  const div = document.createElement('div');
  div.classList.add("contact_info");
  switch (e.target.classList[0]) {
    case "tel": 
      div.textContent = `Телефон: ${e.target.dataset.value}`;
      break;
    case "email":
      div.textContent = `Email: ${e.target.dataset.value}`;
      break;
    case "twitter":
      div.textContent = `Twitter: ${e.target.dataset.value}`;
      break;
    case "vk":
      div.textContent = `Vk: ${e.target.dataset.value}`;
      break;
    case "facebook":
      div.textContent = `Facebook: ${e.target.dataset.value}`;
      break;
  }
  e.target.appendChild(div);
}

function delInfo(e) {
  e.target.querySelector("div").remove();
}

async function delCont(id) {
  const delAns = await fetch(`http://localhost:3000/api/clients/${id}`, {method: "DELETE"});
  loadCards();
  return delAns.status;
}

function winRemove() {
  document.querySelector('.window').remove();
  document.querySelector('.back').remove();
}

function confDelCont(id) {
  const back = document.createElement("div");
  back.addEventListener("click", e => {winRemove()});
  back.classList.add("back");
  document.body.appendChild(back);
  document.body.appendChild(document.getElementById("deleteWindow").content.cloneNode(true));
  let start = Date.now() + 200;
  let timer = setInterval(e => {
    let timePassed = Date.now() - start ;
    document.querySelector(".window").style = `top: ${timePassed / 10}vh`
    if (timePassed > 100) clearInterval(timer);
  }, 20);
  document.querySelector(".x").addEventListener("click", e => {winRemove()});
  document.querySelector(".btn_create").addEventListener('click', e => {
    delCont(id);
    winRemove();
  });
  document.querySelector('.btn_cancel').addEventListener("click", e => {winRemove()});
}

async function editWind(id) {
  const ans = await fetch(`http://localhost:3000/api/clients/${id}`);
  const data = await ans.json();
  document.querySelector(".window").appendChild(document.getElementById("editWindow").content.cloneNode(true));
  document.querySelector(".add_contact_img").src = addContSvg;
  const surname = document.querySelector(".surname");
  const name = document.querySelector(".name");
  const lastname = document.querySelector(".lastname");
    surname.value = data.surname;
    name.value = data.name;
    lastname.value = data.lastName;
    const add = document.querySelector('.add_contact');
    for (let i = 0; i < data.contacts.length; i++) {
      const divData = document.getElementById("contactData").content.cloneNode(true);
      divData.querySelector(".delDataBtn").src = cancelContSvg;
      divData.querySelector('select').value = data.contacts[i].type;
      divData.querySelector('input').value = data.contacts[i].value;
      divData.querySelector(".del_div").addEventListener("click", e => {e.target.parentNode.remove()})
      document.querySelector(".data_div").appendChild(divData);
    }
    document.querySelector(".add_btn").addEventListener("click", e => {
      if (e.target.parentNode.querySelectorAll(".data").length == 10) return;
      const contact = document.getElementById("contactData").content.cloneNode(true);
      contact.querySelector(".del_div").addEventListener('click', e => {e.target.parentNode.remove()})
      contact.querySelector(".delDataBtn").src = cancelContSvg;
      document.querySelector(".data_div").appendChild(contact);
    });
    document.querySelector(".btn_cancel").addEventListener("click", e => {
      delCont(id);
      winRemove();
    })
    document.querySelector(".btn_create").addEventListener('click', async (e) => {
      const obj = {name: name.value, surname: surname.value, lastName: lastname.value, contacts: []}
      document.querySelectorAll(".data").forEach(e => {
        let type = e.querySelector(".select_contcts").value;
        let value = e.querySelector('input').value;
        obj.contacts.push({type, value});
      })
      if (name.value.length == 0 || surname.value.length == 0 || obj.contacts.map(e => e.value).filter(e => e.length > 0).length < obj.contacts.map(e => e.type).length) {
        if (document.querySelectorAll(".error").length == 1) return;
        const err = document.createElement('div');
        err.classList.add("error");
        err.textContent = "Ошибка: все обязательные поля должны быть заполнены!";
        document.querySelector(".window").insertBefore(err, document.querySelector(".btn_create"));
        return;
      }
      const ans = await fetch(`http://localhost:3000/api/clients/${id}`, {method: "PATCH", body: JSON.stringify(obj)});
      winRemove();
      loadCards();
    })
}

function createWindow(type = "edit", elem) {
  if (document.querySelectorAll(".window").length !== 0) return;
  const back = document.createElement("div");
  back.classList.add("back");
  const window = document.createElement("div");
  window.classList.add("window");
  const close = document.createElement('div');
  close.classList.add("x");
  window.appendChild(close);
  back.addEventListener("click", e => {back.remove();window.remove()});
  document.body.appendChild(back);
  document.body.appendChild(window);
  let start = Date.now() + 200;
  let timer = setInterval(e => {
    let timePassed = Date.now() - start ;
    window.style = `top: ${timePassed / 10}vh`
    if (timePassed > 100) clearInterval(timer);
  }, 20);
  close.addEventListener("click", e => {winRemove()});
  if (type === "edit") {
    const id = elem.target.parentNode.parentNode.querySelector(".id").textContent;
    editWind(id);
  } else {
    document.querySelector(".window").appendChild(document.getElementById("createWindow").content.cloneNode(true));
    document.querySelector(".add_contact_img").src = addContSvg;
    const surname = document.querySelector(".surname");
    const name = document.querySelector(".name");
    const lastname = document.querySelector(".lastname");
    document.querySelector(".add_btn").addEventListener("click", e => {
      if (e.target.parentNode.querySelectorAll(".data").length == 10) return;
      const contact = document.getElementById("contactData").content.cloneNode(true);
      contact.querySelector(".delDataBtn").src = cancelContSvg;
      contact.querySelector(".del_div").addEventListener('click', e => {e.target.parentNode.remove()})
      document.querySelector(".data_div").appendChild(contact);
    });
    document.querySelector(".btn_cancel").addEventListener("click", e => {winRemove()});
    document.querySelector(".btn_create").addEventListener('click', async (e) => {
      const obj = {name: name.value, surname: surname.value, lastName: lastname.value, contacts: []}
      document.querySelectorAll(".data").forEach(e => {
        let type = e.querySelector(".select_contcts").value;
        let value = e.querySelector('input').value;
        obj.contacts.push({type, value});
      });
      if (name.value.length == 0 || surname.value.length == 0 || obj.contacts.map(e => e.value).filter(e => e.length > 0).length < obj.contacts.map(e => e.type).length) {
        if (document.querySelectorAll(".error").length == 1) return;
        const err = document.createElement('div');
        err.classList.add("error");
        err.textContent = "Ошибка: все обязательные поля должны быть заполнены!";
        document.querySelector(".window").insertBefore(err, document.querySelector(".btn_create"));
        return;
      }
      const ans = await fetch("http://localhost:3000/api/clients", {method: "POST", body: JSON.stringify(obj)});
      winRemove();
      loadCards();
    })
  }
}

async function searchContact(value) {
  const ans = await fetch(`http://localhost:3000/api/clients?search=${value}`);
  let res = await ans.json();
  res = res.map(a => a.id);
  const place = document.querySelector(".main__load");
  let arr = [...globalContacts];
  arr = arr.filter(a => res.includes(a.childNodes[1].textContent));
  document.querySelectorAll(".contact").forEach(e => {e.remove();});
  arr.forEach(el => {place.appendChild(el)});
}

function loadContacts(data, parent) {
  for (let i = 0; i < data.contacts.length; i++) {
    if (data.contacts.length > 5 && i >= 4) {
      const dop = document.createElement('div');
      dop.classList.add("contact_icons_more");
      dop.textContent = `+${data.contacts.length - 4}`;
      parent.querySelector(".contacts").appendChild(dop);
      dop.addEventListener('click', e => {
        const div = e.target.parentNode;
        div.classList.add("contacts_true");
        dop.remove();
        for (let j = 4; j < data.contacts.length; j++) {
          const contact = document.createElement('div');
          contact.classList.add(data.contacts[j].type);
          contact.classList.add("contact_icon");
          contact.dataset.value = data.contacts[j].value;
          contact.addEventListener('mouseenter', moreInfo);
          contact.addEventListener('click', e => {navigator.clipboard.writeText(moreInfo(e, true))});
          contact.addEventListener('mouseleave', delInfo);
          div.appendChild(contact);
        }
      })
      break;
    }
    const contact = document.createElement('div');
    contact.classList.add(data.contacts[i].type);
    contact.classList.add("contact_icon");
    contact.dataset.value = data.contacts[i].value;
    contact.addEventListener('mouseenter', moreInfo);
    contact.addEventListener('click', e => {navigator.clipboard.writeText(moreInfo(e, true))});
    contact.addEventListener('mouseleave', delInfo);
    parent.querySelector(".contacts").appendChild(contact);
  }
}

async function loadCards() {
  const ans = await fetch("http://localhost:3000/api/clients");
  const data = await ans.json();
  const place = document.querySelector(".main__load");
  document.querySelectorAll(".contact").forEach(e => {e.remove();});
  for (let i = 0; i < data.length; i++) {
    const temp = document.getElementById("contact").content.cloneNode(true);
    const id = temp.querySelector(".id");
    id.textContent = data[i].id;
    id.addEventListener("click", e => {navigator.clipboard.writeText(`http://localhost:5000/?contact=${e.target.textContent}`)});
    temp.querySelector(".fio").textContent = `${data[i].surname} ${data[i].name} ${data[i].lastName}`;
    temp.querySelector(".dateCreate").parentNode.dataset.time = data[i].createdAt;
    temp.querySelector(".dateCreate").textContent = getDate(data[i].createdAt);
    temp.querySelector(".timeCreate").textContent = getTime(data[i].createdAt);
    temp.querySelector(".dateEdit").parentNode.dataset.time = data[i].updatedAt;
    temp.querySelector(".dateEdit").textContent = getDate(data[i].updatedAt);
    temp.querySelector(".timeEdit").textContent = getTime(data[i].updatedAt);
    loadContacts(data[i], temp);
    temp.querySelector(".edit").addEventListener('click', e => {
      createWindow("edit", e);
    });
    temp.querySelector(".delete").addEventListener('click', e => {confDelCont(data[i].id)});
    place.appendChild(temp);
  }
  start()
  globalContacts = document.querySelectorAll(".contact");
  let imgs = [...document.querySelectorAll('img')].slice(1);
  imgs.forEach(e => {
    if (e.classList[0] == "fio_sort") e.parentNode.querySelector('p').textContent = "";
    e.src = "";
  })
}
function start() {
  if (document.querySelectorAll(".contact").length > 0) {
    document.querySelector(".main__load").style = 'background-image: url("");';
    document.querySelector('.main__btn').addEventListener('click', e => {
      createWindow("create");
    })
    document.querySelector('.header__search').addEventListener('keydown', e => {
      if (e.keyCode == 13) {
        if (e.target.value == "" && document.querySelectorAll(".contact").length < globalContacts.length) {
          loadCards();
          return;
        } else if (e.target.value == "") {
          return;
        }
        searchContact(e.target.value);
        e.target.value = "";
      }
    })
  }
}

function theme() {
  const theme = JSON.parse(localStorage.getItem('theme')) ?? "light";
  if (theme !== "light" && theme.state == "dark") document.body.classList.add("dark_theme");
  document.querySelector(".header__button").addEventListener('click', e => {
    document.body.classList.toggle("dark_theme");
    localStorage.setItem("theme", JSON.stringify({state: document.body.classList.length > 0 ? "dark" : "light"}))
  });
}

async function contactPage() {
  const urlParams = new URLSearchParams(location.search);
  const id = urlParams.get('contact');
  if (id == null) return;
  const back = document.createElement("div");
  back.classList.add("back");
  const window = document.createElement("div");
  window.style.top = "12vh";
  window.classList.add("window");
  const close = document.createElement('div');
  close.classList.add("x");
  window.appendChild(close);
  back.addEventListener("click", e => {location.href = "http://localhost:5000"});
  document.body.appendChild(back);
  document.body.appendChild(window);
  close.addEventListener("click", e => {location.href = "http://localhost:5000"});
  editWind(id);
}

contactPage()
loadCards()
sort();
theme();

