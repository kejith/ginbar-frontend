function isAuthenticated() {
    let cookieIndex = document.cookie.indexOf("gbsession");
    if (cookieIndex === -1) return false;

    console.log(document.cookie);
    // check if we have a user logged in
    let user = localStorage.getItem("user");
    if (user && user !== "") {
        return true;
    }

    user = checkUserFromServer();
    if (user && user !== "") {
        localStorage.setItem("user", user);
        return true;
    }
}

async function checkUserFromServer() {
    try {
        const response = await fetch("http://kejith.de:8080/api/check/me", {
            method: "GET",
        });
        const data = await response.json();

        if (response.status === 200) {
            return data.data;
        }
    } catch (error) {
        console.log(error);
    }
    return "";
}

export default isAuthenticated;
