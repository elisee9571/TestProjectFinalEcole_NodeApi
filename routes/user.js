const express = require("express");
const router = express.Router();

const userCtrl = require("../controllers/user");
const auth = require("../middleware/auth");

router.post("/signup", userCtrl.signup);
router.post("/login", userCtrl.login);
router.put("/profil/update", auth, userCtrl.updateProfil);
router.put("/profil/newPassword", auth, userCtrl.newPassword);
router.put("/profil/updatePassword", auth, userCtrl.updatePassword);
router.get("/profil", auth, userCtrl.getProfil);
router.post("/logout", auth, userCtrl.logout);

module.exports = router;
