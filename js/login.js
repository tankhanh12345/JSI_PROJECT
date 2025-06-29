const loginForm = document.querySelector("#login-form");
const emailForm = loginForm.querySelector(".inp-email");
const passwordForm = loginForm.querySelector(".inp-pwd");

console.log(loginForm);

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const email = emailForm.value;
  const password = passwordForm.value;

  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      firebase.firestore().collection("users").doc(user.uid).get().then((doc) => {
        if (doc.exists) {
          const userData = doc.data();
          localStorage.setItem("user_session", JSON.stringify(userData)); // Lưu vào localStorage
         // Chuyển trang tùy theo role_id
          if (userData.role_id === 1) {
            window.location.href = "admin.html";
          } else{
            window.location.href = "index.html";
          }
          
        } else {
          alert("Không tìm thấy thông tin người dùng!");
        }
      });
    })
    .catch((error) => {
      alert("Lỗi: " + error.message);
    });
});