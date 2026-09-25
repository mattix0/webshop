const backendServer = "http://127.0.0.1:8000/api/v1";

async function login(){
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if(!username){
        alert('Username missing!');
    } 
    else if (!password) {
        alert('Password missing!');
    } 
    else { 
        const data = {
            username: username,
            password: password
        };

        const response = await fetch(backendServer + "/login", {
            method: "POST",
            body: JSON.stringify({
                username: username,
                password: password
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        }).then(
            response => response.json()
        ).then(
            json => console.log(json)
        );
    };
};    