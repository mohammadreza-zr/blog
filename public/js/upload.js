$(document).ready(function () {
  var selectedImage = document.getElementById("selectedImage"),
    imageStatus = document.getElementById("imageStatus"),
    progressBar = document.getElementById("progress"),
    progressDiv = document.getElementById("progressDiv"),
    imageUpload = document.getElementById("imageUpload"),
    copy = document.getElementById("copy"),
    thumbnail = document.getElementById("selectedThumbnail"),
    thumbStatus = document.getElementById("thumbStatus");

  selectedImage.title = "فایلی انتخاب نشده است";
  selectedImage.addEventListener("change", () => {
    selectedImage.title = selectedImage.files[0].name;
    imageStatus.innerText = selectedImage.files[0].name;
  });
  thumbnail.title = "فایلی انتخاب نشده است";
  thumbnail.addEventListener("change", () => {
    thumbnail.title = thumbnail.files[0].name;
    thumbStatus.innerText = thumbnail.files[0].name;
  });
  imageUpload.onclick = function () {
    let xhttp = new XMLHttpRequest(); // create new AJAX request
    xhttp.onreadystatechange = function () {
      imageStatus.innerText = this.responseText;
    };
    xhttp.open("POST", "/dashboard/image-upload");
    xhttp.upload.onprogress = function (e) {
      if (e.lengthComputable) {
        let result = Math.floor((e.loaded / e.total) * 100);
        imageStatus.innerText = "در حال آپلود...";
        progressBar.style.width = `${result}%`;
        progressBar.innerText = `${result}%`;
        progressBar.classList.remove("bg-success");
        if (result === 100) {
          imageStatus.innerText = "در حال پردازش تصویر ....";
          progressDiv.style.display = "none";
          copy.style.display = "block";
          selectedImage.value = "";
        }
      }
    };
    xhttp.upload.onloadend = function () {
      progressBar.classList.add("bg-success");
    };
    let formDate = new FormData();
    if (selectedImage.files.length > 0) {
      formDate.append("image", selectedImage.files[0]);
      progressDiv.style.display = "block";
      xhttp.send(formDate);
    } else {
      imageStatus.innerText = "برای اپلود باید عکسی انتخاب نمایید";
    }
  };
  copy.addEventListener("click", () => {
    copy.blur();
    document.getElementById("copy-text").innerText = "کپی شد!";
  });
  function myFunction(x) {
    if (x.matches) {
      imageUpload.innerText = "آپلود";
      imageUpload.style.setProperty("width", "90px", "important");
    } else {
      imageUpload.innerText = "آپلود عکس";
    }
  }
  var x = window.matchMedia("(max-width: 700px)");
  myFunction(x);
  x.addListener(myFunction);
  new ClipboardJS("#copy");
});
