import * as auth from "/jsApiLayer/auth.js";
import * as user from "/jsApiLayer/user.js";
import * as item from "/jsApiLayer/item.js";
import * as images from "/jsApiLayer/images.js";
import * as logs from "/jsApiLayer/logs.js";
import * as recompensa from "/jsApiLayer/recompensa.js";
import * as relato from "/jsApiLayer/relato.js";

window.api = {
  auth,
  user,
  item,
  images,
  logs,
  recompensa,
  relato,
};

console.log("[jsApiLayer] carregado no window.api");
