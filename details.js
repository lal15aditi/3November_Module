const IP = localStorage.getItem('myIp');

let ipAdd = document.querySelector('.ip-add span');
ipAdd.innerText = IP;


async function hitApi(){
    try {
        let url = `https://ipapi.co/${IP}/json/`;

        let response = await fetch(url);
        let data = await response.json();

        return data;
    }
    catch(error) {
        console.log(error);
    }
}

async function collectInfo(){
    let data = await hitApi();
    // console.log(data);

    let location = {
        lat: data.latitude,
        lng: data.longitude
    };

    let info =  {
        location: location,
        city: data.city,
        organisation: data.org,
        region: data.region,
        timeZone: data.timezone,
        pinCode: data.postal
    };
    // console.log(info);

    let currentDateTime = new Date().toLocaleString("en-US", { timeZone: info.timeZone });
    // console.log(currentDateTime);

    let postOffices = await getNearbyPostOffices(info.pinCode);
    let postOfficesCopy = [...postOffices];
    let numOfPin = postOffices.length;
    // console.log(numOfPin);

    document.querySelector('.lat span').innerText = info.location.lat;
    document.querySelector('.long span').innerText = info.location.lng;
    document.querySelector('.city span').innerText = info.city;
    document.querySelector('.org span').innerText = info.organisation;
    document.querySelector('.region span').innerText = info.region;
    document.querySelector('.host span').innerText = data.network;

    document.querySelector('.time-zone span').innerText = info.timeZone;
    document.querySelector('.date-time span').innerText = currentDateTime;
    document.querySelector('.pincode span').innerText = info.pinCode;
    document.querySelector('.msg span').innerText = numOfPin;

    document.querySelector('.map-img>iframe').src = `https://maps.google.com/maps?q=${location.lat}, ${location.lng}&z=18&output=embed`
    

    displayPostOffices(postOffices);
    document.querySelector('.search-input').addEventListener('input', (event) => {
        postOffices = postOfficesCopy.filter(e => {
            return (e.Name.toLowerCase().includes(event.target.value.toLowerCase())) || (e.BranchType.toLowerCase().includes(event.target.value.toLowerCase()));
        })
        
        displayPostOffices(postOffices);
    })

    document.querySelector('.loader').classList.toggle('d-none');
    document.querySelector('.main').classList.toggle('d-none');
}

async function getNearbyPostOffices(pincode) {
    try {
        const apiUrl = `https://api.postalpincode.in/pincode/${pincode}`;
  
        const response = await fetch(apiUrl);
        const data = await response.json();

        let postOffices = data[0].PostOffice;

        return postOffices;
    }
    catch(error) {
        console.log(error);
    }
}

function displayPostOffices(postOffices){
    let poContainer = document.querySelector('.po-grid');
    poContainer.innerHTML = '';
    postOffices.forEach(e => {
        let poCard = document.createElement('div');
        poCard.className = 'po-box';
        poCard.innerHTML = `
            <p class="name"><b>Name : </b><span>${e.Name}</span></p>
            <p class="branch-name"><b>Branch Type : </b><span>${e.BranchType}</span></p>
            <p class="delivery-status"><b>Delivery Status : </b><span>${e.DeliveryStatus}</span></p>
            <p class="district"><b>District : </b><span>${e.District}</span></p>
            <p class="division"><b>Division : </b><span>${e.Division}</span></p>
        `;

        poContainer.append(poCard);
    })
}

collectInfo();