const backendServer = "http://127.0.0.1:8000/api/v1";

const header = {
    "Content-type": "application/json; charset=UTF-8"
}

async function login(){
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;    
    const data = {
        username: username,
        password: password
    };

    const response = await fetch(backendServer + "/login", {
        method: "POST",
        body: JSON.stringify(data),
        headers: header
    });
};

async function register(){
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;

    const data = {
        username: username,
        password: password,
        first_name: firstName,
        last_name: lastName,
        email: email,
        phone: phone
    };

    const response = await fetch(backendServer + "/register", {
        method: "POST",
        body: JSON.stringify(data),
        headers: header
    });

    if(response.status == 201){
        alert('User created!');
        window.location.href = 'login.html';
    }
    else if (response.status == 409){
        // user already exists
        alert('User already exists.');
    }
    else if (response.status == 422){
        // missing or invalid values
        alert('Invalid or missing data.');
    }
};