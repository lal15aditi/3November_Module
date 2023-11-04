async function getPublicIp(){
    try {
        const ipUrl = 'https://api.ipify.org?format=json';
        // const ipUrl = 'https://ipinfo.io/json';

        let response = await fetch(ipUrl);
        let data = await response.json();

        ip.innerText = data.ip;
        localStorage.setItem("myIp", data.ip);
    }
    catch(error) {
        console.log(error);
    }
}
getPublicIp();

document.querySelector('.start-btn').addEventListener('click', () => {
    let link = document.createElement('a');
    link.href = 'details.html';
    link.click();
})