"use strict";

// Obtener elementos del DOM
var openModalButton = document.getElementById("openModalButton");
var modal = document.getElementById("myModal");
var closeButton = document.querySelector(".close");
var copyButton = document.getElementById("copyButton");
var copyLink = document.getElementById("copyLink"); // Abrir el modal al hacer clic en el botón

openModalButton.addEventListener("click", function () {
  document.querySelector("#alert-copy").style.display = "none";
  modal.style.display = "block";
}); // Cerrar el modal al hacer clic en la "x"

closeButton.addEventListener("click", function () {
  modal.style.display = "none";
}); // Copiar el enlace al hacer clic en el botón de copia

copyButton.addEventListener("click", function () {
  var textToCopy = copyLink.value;
  var dummyElement = document.createElement("input");
  document.body.appendChild(dummyElement);
  dummyElement.value = textToCopy;
  dummyElement.select();
  document.execCommand("copy");
  document.body.removeChild(dummyElement);
  document.querySelector("#alert-copy").style.display = "block";
});