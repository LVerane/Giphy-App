var animals = ["cat", "dog", "sheep", "bunny", "wolf", "racoon"];

var position = 0;

function renderButton() {
    for (i = position; i < animals.length; i++) {
        animal = animals[i].charAt(0).toUpperCase() + animals[i].slice(1);
        // console.log(animal);
        $("#buttons-view").append($(`<button class=animal-btn data-name=${animal}>${animal}</button>`));
        position++;
    }
}

$("#add-gif").on("click", function (event) {

    event.preventDefault();

    newAnimal = $("#gif-input").val().trim();
    // console.log(newAnimal);

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
        var arr = response.data;
        arr.forEach(function (gif, i) {

            // console.log(gif)

            var newDiv = $(`<div class=show-gif>`);
            var favButton = $(`<button class=fav data-animated=${gif.images.fixed_height.url} data-still=${gif.images.fixed_height_still.url} data-rating=${gif.rating} data-title=${gif.title}>Mark Favourite</button>`)
            var newImg = $(`<img data-state=still class=gif>`)
            var newRating = $("<p>").text(`Rating: ${gif.rating}`);
            var newTitle = $("<p>").text(`Title: ${gif.title}`);

            newImg.attr("data-animate", gif.images.fixed_height.url)
            newImg.attr("data-still", gif.images.fixed_height_still.url)
            newImg.attr("src", gif.images.fixed_height_still.url);

            newDiv.prepend(newImg, newTitle, newRating, favButton);
            $("#animalGifs").prepend(newDiv);

        })
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

var favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
// console.log(favorites)

function makeFavorite() {

    var userFavs = { favAnimated: $(this).attr("data-animated"), favStill: $(this).attr("data-still"), favTitle: $(this).attr("data-title"), favRating: $(this).attr("data-rating") }
    // console.log("userFavs = " + JSON.stringify(userFavs));
    favorites.push(userFavs);
    // console.log("favorites = " + JSON.stringify(favorites));

    localStorage.setItem("favorites", JSON.stringify(favorites));

    loadFavorite();
}

var globalCount = 0;

function loadFavorite() {
    var arr = JSON.parse(localStorage.favorites);
    
    //needed a global count for it to work and not generate all favorites every time a new one is added
    for(i=globalCount; i<arr.length; i++){
    // arr.forEach(function (userFavs, i) {

        var newDiv = $(`<div class=show-gif>`);
        var newImg = $(`<img data-state=still class=gif>`)
        var newRating = $("<p>").text(`Rating: ${arr[i].favRating}`);
        var newTitle = $("<p>").text(`Title: ${arr[i].favTitle}`);

        newImg.attr("data-animate", arr[i].favAnimated)
        newImg.attr("data-still", arr[i].favStill)
        newImg.attr("src", arr[i].favStill);

        newDiv.prepend(newImg, newTitle, newRating);
        $("#favorites").prepend(newDiv);
    // })
    globalCount++;
    }
    
}

$("#clearFavs").on("click", function () {
    localStorage.clear();
    $("#favorites").html("");
    // console.log(localStorage);
});

$(document).on("click", ".fav", makeFavorite);

$(document).on("click", ".gif", animateGif);

$(document).on("click", ".animal-btn", displayGif);

renderButton();

loadFavorite();