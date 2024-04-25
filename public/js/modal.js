// Obtener elementos del DOM
const openModalButton = document.getElementById("openModalButton");
const modal = document.getElementById("myModal");
const closeButton = document.querySelector(".close");
const copyButton = document.getElementById("copyButton");
const copyLink = document.getElementById("copyLink");

// Abrir el modal al hacer clic en el botón
openModalButton.addEventListener("click", () => {
    document.querySelector("#alert-copy").style.display="none";
  modal.style.display = "block";
});

// Cerrar el modal al hacer clic en la "x"
closeButton.addEventListener("click", () => {
  modal.style.display = "none";
});

// Copiar el enlace al hacer clic en el botón de copia
copyButton.addEventListener("click", () => {
  const textToCopy = copyLink.value;
  const dummyElement = document.createElement("input");
  document.body.appendChild(dummyElement);
  dummyElement.value = textToCopy;
  dummyElement.select();
  document.execCommand("copy");
  document.body.removeChild(dummyElement);
  document.querySelector("#alert-copy").style.display="block";

});
