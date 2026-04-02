import { createEl } from "@core/utils";

export default function loginBackground({ container }) {
  container.style.position = "relative";

  const imgTop = createEl("div", { className: "login-img-container top-img" });
  const imgBottom = createEl("div", {
    className: "login-img-container bottom-img",
  });

  imgTop.style.zIndex = -1;
  imgBottom.style.zIndex = -2;
  imgTop.classList.remove("hide");

  container.append(imgBottom, imgTop);

  const photoURLs = [];
  for (let n = 1; n <= 6; n++) {
    photoURLs.push(`/images/site-photo-${n}.jpg`);
  }
  const arrLength = photoURLs.length;

  let i = 0;
  const staticDuration = 10000;
  const fadeDuration = 3000;

  imgTop.style.backgroundImage = `url(${photoURLs[0]})`;
  imgBottom.style.backgroundImage = `url(${photoURLs[arrLength - 1]})`;

  function changeImg() {
    i = (i + 1) % arrLength;

    imgBottom.style.backgroundImage = imgTop.style.backgroundImage;
    imgTop.style.backgroundImage = `url(${photoURLs[i]})`;
    imgTop.style.opacity = 0;

    imgTop.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: fadeDuration,
      easing: "ease",
      fill: "forwards",
    }).onfinish = () => {
      imgTop.style.opacity = 1;
      setTimeout(changeImg, staticDuration);
    };
  }

  setTimeout(changeImg, staticDuration);
}
