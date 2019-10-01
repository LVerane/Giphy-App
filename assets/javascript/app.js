var animals = ["cat", "dog", "sheep", "bunny", "wolf", "racoon"];

var position = 0;



function renderButton() {
    for (i = position; i < animals.length; i++) {
        animal = animals[i].charAt(0).toUpperCase() + animals[i].slice(1);
        console.log(animal);
        $("#buttons-view").append($(`<button class=animal-btn data-name=${animal}>${animal}</button>`));
        position++;
    }
}

$("#add-gif").on("click", function (event) {

    event.preventDefault();

    newAnimal = $("#gif-input").val().trim();
    console.log(newAnimal);

    animals.push(newAnimal);

    $("#gif-input").val("");

    renderButton();
});


function displayGif() {
    var gif = $(this).attr("data-name");
    var queryURL = "https://api.giphy.com/v1/gifs/search?api_key=EOZ19rTF7jEoLoW62HdEMAhgfmg0Ajlc&limit=10&q=" + gif;

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {

        for (i = 0; i < response.data.length; i++) {
            console.log(response.data[i])

            var newDiv = $(`<div class=show-gif>`);
            var favButton = $(`<button class=fav data-link=${queryURL} data-position=${i}>Mark Favourite</button>`)
            var newImg = $(`<img data-state=still class=gif>`)
            var newRating = $("<p>").text(`Rating: ${response.data[i].rating}`);
            var newTitle = $("<p>").text(`Title: ${response.data[i].title}`);

            newImg.attr("data-animate", response.data[i].images.fixed_height.url)
            newImg.attr("data-still", response.data[i].images.fixed_height_still.url)
            newImg.attr("src", response.data[i].images.fixed_height_still.url);

            newDiv.prepend(newImg, newTitle, newRating, favButton);
            $("#animalGifs").prepend(newDiv);


        }
    });

}

function animateGif() {
    var state = $(this).attr("data-state")
    if (state === "still") {
        $(this).attr("src", $(this).attr("data-animate"));
        $(this).attr("data-state", "animate");
    } else if (state === "animate") {
        $(this).attr("src", $(this).attr("data-still"));
        $(this).attr("data-state", "still");
    }
};

// var favorites = [];
// var favPosition = 0;
var test = [];
// localStorage.favorites[i] //use .length to loop trough it

function makeFavorite() {//save eahc one as an object
    // console.log($(this).attr("data-still"))
    // var favorite = {favStill : $(this).attr("data-still"), favAnimate : $(this).attr("data-animate")}
    // console.log(favLink)
    favLink = $(this).attr("data-link")
    favPosition = $(this).attr("data-position")
    var favorite = {link : favLink, position : favPosition}
    // var favorite = { favLink: $(this).attr("data-link"), favPosition: $(this).attr("data-position") }
    console.log("favorite="+favorite.link+favorite.position)
    // favorites.push(favorite)
    // console.log("favorites= " + favorites)
    // localStorage.setItem('firstFavorite', JSON.stringify(favorite))
    // localStorage.favorites = favorites
    // console.log("local.favorites= " + localStorage)
    test.push({link : favLink, position : favPosition})//other option
}

function loadFavorite() {
    console.log(localStorage.favorites)
    // for (var j = 0; j < localStorage.favorites.length; j++) {
        // $.ajax({
        //     url: queryURL,
        //     method: "GET"
        // }).then(function (response) {
        //     for (i = 0; i < response.data.length; i++) {
        //         console.log(response.data[i])
    
        //         var newDiv = $(`<div class=show-gif>`);
        //         var favButton = $(`<button class=fav data-link=${queryURL} data-position=${i}>Mark Favourite</button>`)
        //         var newImg = $(`<img data-state=still class=gif>`)
        //         var newRating = $("<p>").text(`Rating: ${response.data[i].rating}`);
        //         var newTitle = $("<p>").text(`Title: ${response.data[i].title}`);
    
        //         newImg.attr("data-animate", response.data[i].images.fixed_height.url)
        //         newImg.attr("data-still", response.data[i].images.fixed_height_still.url)
        //         newImg.attr("src", response.data[i].images.fixed_height_still.url);
    
        //         newDiv.prepend(newImg, newTitle, newRating, favButton);
        //         $("#animalGifs").prepend(newDiv);
    
    
        //     }
        // });
    // }
}

// loadFavorite()

$(document).on("click", ".fav", makeFavorite);

$(document).on("click", ".gif", animateGif);

$(document).on("click", ".animal-btn", displayGif);

renderButton();