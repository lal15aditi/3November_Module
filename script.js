async function getPublicIp(){
    const ipUrl = 'https://api.ipify.org?format=json';
    // const ipUrl = 'https://ipinfo.io/json';

    let response = await fetch(ipUrl);
    let data = await response.json();

    // console.log(JSON.stringify(data));
    ip.innerText = data.ip;
    localStorage.setItem("myIp", data.ip);
    // console.log(data.ip);
    // return data;
}
getPublicIp();

document.querySelector('.start-btn').addEventListener('click', () => {
    let link = document.createElement('a');
    link.href = 'details.html';
    link.click();
})