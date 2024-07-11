console.log("hello world")

let currentsong = new Audio()
let allsongs;
let currFolder;
let songsin;


function secondsToMmSs(seconds) {
    var minutes = Math.floor(seconds / 60);
    var remainingSeconds = Math.floor(seconds % 60) 

    // Ensuring both values are two digits
    var minutesStr = minutes.toString().padStart(2, '0');
    var secondsStr = remainingSeconds.toString().padStart(2, '0');

    return minutesStr + ':' + secondsStr;
}


const playsong = (track,pause=false) => {
    currentsong.src = `/${currFolder}/` + track
    currentsong.play()
    if(!pause){
        play.src = '/img/pause.svg';
        
    }
    document.querySelector('.songinfo').innerHTML =  decodeURI(track);
    document.querySelector('.songduration').innerHTML = '00:00/00:00' 
}



//Fetching all the songs from the songs folder
async function getsongs(folder) {
    currFolder = folder;
    let songs = await fetch(`/${currFolder}/`)
    let response = await songs.text()
    // console.log(response)
    let div = document.createElement("div")
    div.innerHTML = response
    let as = div.getElementsByTagName("a")
    // console.log(as)
    songsin = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith('.mp3')) {
            songsin.push(element.href.split(`/${currFolder}/`)[1])
        }
    }
        // songlist library in which i display all the lists of songs that i have in the songs folder
        let songul = document.querySelector('.songlist').getElementsByTagName('ul')[0]
        songul.innerHTML = "";
        for (const song of songsin) {
            songul.innerHTML = songul.innerHTML + `<li>
                                        <img class="invert" src="/img/music.svg" alt="">
                                <div class="info">
                                    <div>  ${song.replaceAll('%20', " ")} </div>
                                    <div> Hassan</div>
                                </div>
                                <img id="playmusic" class=" invert"  src="/img/play.svg" alt="">
                                <img id="pausemusic" class= "invert hidden"  src="/img/pause.svg" alt="">
    
    
                                
                                </li>`
        }
    
        Array.from(document.querySelector('.songlist').getElementsByTagName('li')).forEach(e => {
            e.addEventListener('click', function () {
                // console.log(e.querySelector("div").firstElementChild.innerHTML)
                playsong(e.querySelector("div").firstElementChild.innerHTML.trim())
            })
        })
}


async function displayalbums(){
    let songs = await fetch(`/songs/`)
    let response = await songs.text()
    // console.log(response)
    let div = document.createElement("div")
    div.innerHTML = response
    let anchors = div.getElementsByTagName('a')
    // console.log(anchors)
    let cardContainer  =document.querySelector('.card-container')
    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        
    
        
        if(e.href.includes('/songs/') && !e.href.includes('.htaccess')){
            let folder = (e.href.split('/').slice(-2)[1])
            // console.log(folder)
            let songs = await fetch(`/songs/${folder}/info.json`)
            let response = await songs.json()
            // console.log(response)
            cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="${folder}" class="card ">
                        <div class="play">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="#000"
                                xmlns="http://www.w3.org/2000/svg">
                                <path d="M5 20V4L19 12L5 20Z" stroke="#141B34" stroke-width="1.5"
                                    stroke-linejoin="round" />
                            </svg>

                        </div>
                        <img src="/songs/${folder}/cover.jpeg" alt="">
                        <h2>${response.heading}</h2>
                        <p>${response.Description} </p>
                    </div>`
        }
    }
        //load the library whenever you click on the card
        Array.from(document.getElementsByClassName('card')).forEach(e => {
            e.addEventListener('click',async item=>{
                allsongs = await getsongs(`songs/${item.currentTarget.dataset.folder}`)
                
            })
        });
    
    
    
}



async function main() {
    //Here i give the locations form where the songs is coming 
    await getsongs(`songs/ncs`)
    playsong(songsin[0],true)

    //Display all the albums on the page
    displayalbums()



    //playlist bar play and stop song
    play.addEventListener('click', function () {
        if (currentsong.paused) {
            currentsong.play()
            play.src = '/img/pause.svg'
        }
        else {
            currentsong.pause()
            play.src = '/img/play.svg'
        }
    })

    currentsong.addEventListener('timeupdate',function(){
        document.querySelector('.songduration').innerHTML = `${secondsToMmSs(currentsong.currentTime)}/${secondsToMmSs(currentsong.duration)}`
        document.querySelector('.circle').style.left = (currentsong.currentTime/currentsong.duration )*100 + '%';
    })


    //Add Event listner to seekbar
    document.querySelector('.seekbar').addEventListener('click',function(e){
        let percent = e.offsetX/e.target.getBoundingClientRect().width * 100 
        document.querySelector('.circle').style.left = percent  + '%';
        currentsong.currentTime = ((currentsong.duration)*percent)/100 
    })

    let hamburger_svg = document.querySelector('.hamburger')
    hamburger_svg.addEventListener('click',function(){
        let left = document.querySelector('.left')
        left.style.left  = 0;
    })

    
    let cross_svg = document.querySelector('.cross_svg')
    cross_svg.addEventListener('click',function(){
        let left = document.querySelector('.left')
        left.style.left  = -100 + '%';
    })


    previous.addEventListener('click',function(){
        console.log("previous clicked")
        let index = songsin.indexOf(currentsong.src.split('/').slice(-1)[0])
        if((index-1)>=0){
            playsong(songsin[index-1])
        }
    })
    
    forward.addEventListener('click',function(){
        console.log("forward clicked")
        let index = songsin.indexOf(currentsong.src.split('/').slice(-1)[0])
        if((index+1)<songsin.length){
            playsong(songsin[index+1])
        }
    })

    //Increase the volume with the range you given
    document.querySelector('.volume').getElementsByTagName('input')[0].addEventListener('change',function(e){
        currentsong.volume = parseInt(e.target.value)/100
    })
    





}
main()



