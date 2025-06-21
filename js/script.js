let currentSong= new Audio();
let songs;
let currfolder;
function formatTime(seconds) {
    // Ensure the input is a positive integer
    seconds = Math.abs(Math.round(seconds));

    // Calculate minutes and remaining seconds
    var minutes = Math.floor(seconds / 60);
    var remainingSeconds = seconds % 60;

    // Pad single-digit seconds with a leading zero
    var formattedSeconds = remainingSeconds < 10 ? "0" + remainingSeconds : remainingSeconds;

    // Create the formatted time string
    var formattedTime = minutes + ":" + formattedSeconds;

    return formattedTime;
}

    const playMusic=(track, pause=false)=>{
       // let audio= new Audio("/songs/" + track)
       currentSong.src= `${currfolder}/` + track;
       if(!pause){
        currentSong.play();
        play.src="img/pause.svg"
       }
       
       
       document.querySelector(".songinfo").innerHTML=decodeURI(track)
       document.querySelector(".songtime").innerHTML="00:00/00:00"

       
    }



async function getSongs(folder) {
    try {
        currfolder = folder;
        console.log("Fetching songs from:", folder);
        
        // Fetch the songs.json manifest file instead of parsing directory listing
        let response = await fetch(`/${folder}/songs.json`);
        let data = await response.json();
        
        // Extract song filenames from the manifest
        songs = data.songs.map(song => song.filename);
        
        console.log("Songs loaded from manifest:", songs);

        // Show all the songs in the playlist
        let songUL = document.querySelector(".songsList").getElementsByTagName("ul")[0];
        songUL.innerHTML = "";
        
        for (const song of songs) {
            // Find the song data from manifest
            const songData = data.songs.find(s => s.filename === song);
            const displayName = songData ? songData.title : song.replaceAll("%20", " ").replaceAll("_320(PagalWorld.com.cm).mp3", "");
            const artist = songData ? songData.artist : "Song Artist";
            
            songUL.innerHTML = songUL.innerHTML + `<li>
                <img src="img/music.svg" class="invert" alt="">
                <div class="info">
                  <div class="Song Name">${displayName}</div>
                  <div class="Song Artist">${artist}</div>
                </div>
                <div class="playnow">
                  <span>Play Now</span>
                  <img src="img/play1.svg" class="invert" alt="">
                </div> </li>`;
        }
    
        // Attach an event listener to each song
        Array.from(document.querySelector(".songsList").getElementsByTagName("li")).forEach(e => {
            e.addEventListener("click", element => {
                const songName = e.querySelector(".info").firstElementChild.innerHTML;
                console.log("Clicked on:", songName);
                // Find the actual filename for this song
                const songData = data.songs.find(s => s.title === songName);
                const filename = songData ? songData.filename : songName;
                playMusic(filename);
            });
        });
        
        return songs;
    } catch (error) {
        console.error("Error loading songs:", error);
        songs = [];
        return [];
    }
}

async function displayAlbums(){
    try {
        // Fetch the albums.json manifest file instead of parsing directory listing
        let response = await fetch(`/songs/albums.json`);
        let data = await response.json();
        
        let cardContainer = document.querySelector(".cardContainer");
        cardContainer.innerHTML = ""; // Clear existing content
        
        console.log("Albums loaded from manifest:", data.albums);
        
        for (const album of data.albums) {
            cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="${album.folder}" class="card">
                <div class="play">
                  <img src="img/play.svg" alt="" width="35px" height="35px" />
                </div>
                <img
                  src="/songs/${album.folder}/${album.cover}"
                  alt=""
                />
                <h2>${album.title}</h2>
                <p>${album.description}</p>
              </div>`;
        }

        // Load the playlist whenever card is clicked
        Array.from(document.getElementsByClassName("card")).forEach(e => {
            e.addEventListener("click", async item => {
                try {
                    let songsResult = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
                    if (songsResult && songsResult.length > 0) {
                        songs = songsResult;
                        playMusic(songs[0]);
                    } else {
                        console.warn("No songs found for folder:", item.currentTarget.dataset.folder);
                    }
                } catch (error) {
                    console.error("Error loading songs:", error);
                }
            });
        });
    } catch (error) {
        console.error("Error loading albums:", error);
    }
}

async function main() {
    try {
        console.log("Starting Spotify Clone...");
        
        // GET THE LIST OF ALL SONGS
        await getSongs("songs/cs");
        if (songs && songs.length > 0) {
            playMusic(songs[0], true);
        } else {
            console.warn("No songs found in songs/cs");
        }

        // Displaying albums
        await displayAlbums();
        
        console.log("Spotify Clone initialized successfully");
    } catch (error) {
        console.error("Error in main function:", error);
    }
}

//Attach an event listener to play,next and previous
play.addEventListener("click",()=>{
    if(currentSong.paused){
        currentSong.play()
        play.src="img/pause.svg"
    }
    else{
        currentSong.pause()
        play.src="img/play1.svg"
    }
})

//Listen for timeupdate event
currentSong.addEventListener("timeupdate",()=>{
   
    document.querySelector(".songtime").innerHTML=`
    ${formatTime(currentSong.currentTime)}/${formatTime(currentSong.duration)}`
    // Assuming currentSong is a reference to your audio or video element
var circleElement = document.querySelector(".circle");

// Assuming you're inside a scope where currentSong is defined
currentSong.addEventListener("timeupdate", function() {
    // Update the position of the "circle" element based on the current time
    circleElement.style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
});

document.querySelector(".seekbar").addEventListener("click", e => {
   
    const seekbarWidth = e.target.getBoundingClientRect().width;
    const clickPosition = e.offsetX;
    
    // Update the position of the "circle" element
    document.querySelector(".circle").style.left = (clickPosition / seekbarWidth) * 100 + "%";
    
    // Calculate and set the playback time of currentSong
    const newPlaybackTime = (currentSong.duration) * (clickPosition / seekbarWidth);
    currentSong.currentTime = newPlaybackTime;
});      
})

//Add an event listener for hamburger
document.querySelector(".hamburger").addEventListener("click",()=>{
    
    document.querySelector(".left").style.left= "0%";
})

//Add an event listener for close
document.querySelector(".close").addEventListener("click",()=>{
    
    document.querySelector(".left").style.left= "-110%";
})

//Add an event listener to previous and next
previous.addEventListener("click",()=>{
    let index = songs.indexOf(currentSong.src.split("/").slice(-1) [0]);
    if((index-1) >=0 ){
     playMusic(songs[index-1])
    }
     
 })
   
    


next.addEventListener("click",()=>{
    currentSong.pause()
   
    let index = songs.indexOf(currentSong.src.split("/").slice(-1) [0]);
   if((index+1) < songs.length){
    playMusic(songs[index+1])
   }
    
})



// Add event listener for the input event to detect changes in the volume range
document.getElementById("volume").addEventListener("input", function() {
    // Get the volume value from the range input (value is between 0 and 100)
    const volumeValue = parseInt(this.value) / 100;
    
    // Set the volume of the audio element to the calculated volume value
    currentSong.volume = volumeValue;
});

// Add event listener to mute the track
document.querySelector(".volume>img").addEventListener("click",e=>{
  if(e.target.src.includes("img/volume.svg")){
    e.target.src=e.target.src.replace("img/volume.svg","img/mute.svg")
    currentSong.volume=0;
    document.querySelector(".range").getElementsByTagName("input")[0].value = 0
  }
  else{
    currentSong.volume=0.5
    e.target.src=e.target.src.replace("img/mute.svg","img/volume.svg")
    document.querySelector(".range").getElementsByTagName("input")[0].value = 10
  }
})

main()
