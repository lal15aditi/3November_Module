const IP = localStorage.getItem('myIp');

let ipAdd = document.querySelector('.ip-add span');
ipAdd.innerText = IP;


async function hitApi(){
    let url = `https://ipapi.co/${IP}/json/`;

    let response = await fetch(url);
    let data = await response.json();

    return data;
}

// hitApi();
// let hitApiData = `{
//     "ip":"42.110.166.21","network":"42.110.160.0/20","version":"IPv4","city":"Kolkata","region":"West Bengal","region_code":"WB","country":"IN","country_name":"India","country_code":"IN","country_code_iso3":"IND","country_capital":"New Delhi","country_tld":".in","continent_code":"AS","in_eu":false,"postal":"700059","latitude":22.518,"longitude":88.3832,"timezone":"Asia/Kolkata","utc_offset":"+0530","country_calling_code":"+91","currency":"INR","currency_name":"Rupee","languages":"en-IN,hi,bn,te,mr,ta,ur,gu,kn,ml,or,pa,as,bh,sat,ks,ne,sd,kok,doi,mni,sit,sa,fr,lus,inc","country_area":3287590,"country_population":1352617328,"asn":"AS38266","org":"Vodafone Idea Ltd"
// }`
// hitApiData = JSON.parse(hitApiData);
// console.log(hitApiData);


async function collectInfo(){
    let data = await hitApi();
    console.log(data);

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
            return e.Name.toLowerCase().includes(event.target.value.toLowerCase());
        })
        
        displayPostOffices(postOffices);
    })

    document.querySelector('.loader').classList.toggle('d-none');
    document.querySelector('.main').classList.toggle('d-none');
}

async function getNearbyPostOffices(pincode) {
    const apiUrl = `https://api.postalpincode.in/pincode/${pincode}`;
  
    const response = await fetch(apiUrl);
    const data = await response.json();

    let postOffices = data[0].PostOffice;

    return postOffices;
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