// theme.js
const themes = {
  green: {
    "--bg-color": "black",
    "--text-color": "#00ff00",
    "--link-color": "#00bfff"
  },
  noir: {
    "--bg-color": "#000000",
    "--text-color": "#ffffff",
    "--link-color": "#cccccc"
  },
  comfort: {
    "--bg-color": "#1e1e2e",
    "--text-color": "#dcdcdc",
    "--link-color": "#82aaff"
  }
};

let order = ["green", "noir", "comfort"];
let index = 0;

function cycleTheme() {
  index = (index + 1) % order.length;
  let theme = themes[order[index]];
  for (let key in theme) {
    document.documentElement.style.setProperty(key, theme[key]);
  }
}
