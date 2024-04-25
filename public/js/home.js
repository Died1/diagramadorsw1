document.addEventListener("DOMContentLoaded", function () {
    var nameInput = document.querySelector("#form-join #name");
    var btnSubmit = document.querySelector("#form-join #btnSubmit");
    nameInput.addEventListener("input", function () {
        (nameInput.value.trim()
            !== "") ? btnSubmit.removeAttribute("disabled") :
            btnSubmit.setAttribute("disabled", "disabled");
    });
})