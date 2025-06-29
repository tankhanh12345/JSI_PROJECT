const registerForm = document.querySelector("#register-form");

console.log(registerForm);

registerForm.addEventListener("submit", (event) =>{
    event.preventDefault()

    let username = registerForm.querySelector(".inp-username").value;
    let email = registerForm.querySelector(".inp-email").value;
    let password = registerForm.querySelector(".inp-pwd").value;
    let confirmPassword = registerForm.querySelector(".inp-cf-pw").value;
    let role_id = 2; 


    // check fields empty
    if (!username || !email || !password || !confirmPassword) {
        alert("Vui lòng điền đủ các trường");
        return;
    }
    if (password != confirmPassword) {
        alert("Mật khẩu không khớp");
        return;
    }

    // Tạo tài khoản với Firebase Auth
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signed in 
            var user = userCredential.user;
            console.log(user.uid);
            // Thông tin người dùng
            let userData = {
                username,
                email,
                password,
                role_id: role_id,
                balance: 0, // số dư ví mặc định là 0
            }
            db.collection("users").doc(user.uid).set(userData)
                .then((docRef) => {
                    alert("Đăng ký thành công");
                    window.location.href = "login.html";
                })
                .catch((error) => {
                    alert("Đăng ký thất bại");
                });
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            // ..
            alert(`Lỗi: ${errorMessage}`);
            console.log(errorMessage);
        });
});