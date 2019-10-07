var animals = ["cat", "dog", "sheep", "bunny", "wolf", "racoon"];

var position = 0;
var newAnimal;

function renderButton() {
    for (i = position; i < animals.length; i++) {
        animal = animals[i].charAt(0).toUpperCase() + animals[i].slice(1);
        $("#buttons-view").append($(`<button class=animal-btn data-name=${animal}>${animal}</button>`));
        position++;
    }
}

$("#add-gif").on("click", function (event) {
    event.preventDefault();

    newAnimal = $("#gif-input").val().trim();
    animals.push(newAnimal);

    $("#gif-input").val("");

    renderButton();
    displayGif();
});


function displayGif() {
    $("#gif-result").attr("hidden", false)
    var gif = $(this).attr("data-name");
    if(gif === undefined){
        gif = newAnimal;
    }
    offset = Math.floor(Math.random() * 100)
    var queryURL = "https://api.giphy.com/v1/gifs/search?api_key=EOZ19rTF7jEoLoW62HdEMAhgfmg0Ajlc&limit=10&q=" + gif + "&offset=" + offset;

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        var arr = response.data;
        arr.forEach(function (gif) {

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

function makeFavorite() {

    var userFavs = { favAnimated: $(this).attr("data-animated"), favStill: $(this).attr("data-still"), favTitle: $(this).attr("data-title"), favRating: $(this).attr("data-rating") }
    favorites.push(userFavs);

    localStorage.setItem("favorites", JSON.stringify(favorites));

    loadFavorite();
}

var globalCount = 0;

function loadFavorite() {
    if (localStorage.favorites === undefined) {
        $("#fav-box").attr("hidden", true)
    } else {
        $("#fav-box").attr("hidden", false)
        var arr = JSON.parse(localStorage.favorites);

        //needed a global count for it to work and not generate all favorites every time a new one is added
        for (i = globalCount; i < arr.length; i++) {

            var newDiv = $(`<div class=show-gif>`);
            var newImg = $(`<img data-state=still class=gif>`)
            var newRating = $("<p>").text(`Rating: ${arr[i].favRating}`);
            var newTitle = $("<p>").text(`Title: ${arr[i].favTitle}`);

            newImg.attr("data-animate", arr[i].favAnimated)
            newImg.attr("data-still", arr[i].favStill)
            newImg.attr("src", arr[i].favStill);

            newDiv.prepend(newImg, newTitle, newRating);
            $("#favorites").prepend(newDiv);

            globalCount++;
        }
    }

}

$("#clear-favs").on("click", function () {
    localStorage.clear();
    $("#favorites").html("");
    $("#fav-box").attr("hidden", true)
});

$("#show-favs").on("click", function () {
    $("#hide-favs").attr("hidden", false)
    $("#show-favs").attr("hidden", true)
    $("#favorites").attr("hidden", false)
});

$("#hide-favs").on("click", function () {
    $("#hide-favs").attr("hidden", true)
    $("#show-favs").attr("hidden", false)
    $("#favorites").attr("hidden", true)
});

$(document).on("click", ".fav", makeFavorite);

$(document).on("click", ".gif", animateGif);

$(document).on("click", ".animal-btn", displayGif);

renderButton();

loadFavorite();