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

function onLoad() {
    if (localStorage.favLink === undefined) {
        favLink = [];
        console.log("is undefined")
    } else {
        favLink = JSON.parse(localStorage.favLink)
        console.log("is defined")
    }

    if (localStorage.favPosition === undefined) {
        favPosition = [];
    } else {
        favPosition = JSON.parse(localStorage.favPosition)
    }
}

onLoad();

function makeFavorite() {

    favLink.push($(this).attr("data-link"))
    favPosition.push($(this).attr("data-position"))

    console.log(favLink)
    console.log(favPosition)

    localStorage.favLink = JSON.stringify(favLink)
    localStorage.favPosition = JSON.stringify(favPosition)
    console.log(localStorage.favLink)
    console.log(localStorage.favPosition)

    console.log("length" + favLink.length)
    console.log("length" + favPosition.length)

    loadFavorite()
}

var j = 0;

//maybe allow hide favorites?
//need a proper on document ready function
//need a clear favorite/localStorage function/button
function loadFavorite() {
    // for(j=0; j<favLink.length; j++){
    if (j < favLink.length) {
        var queryURL = favLink[j]
        console.log(queryURL)
        var i = favPosition[j]
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            console.log(response)

            var newDiv = $(`<div class=show-gif>`);
            // var favButton = $(`<button class=fav data-link=${queryURL} data-position=${i}>Mark Favourite</button>`)
            var newImg = $(`<img data-state=still class=gif>`)
            var newRating = $("<p>").text(`Rating: ${response.data[i].rating}`);
            var newTitle = $("<p>").text(`Title: ${response.data[i].title}`);

            newImg.attr("data-animate", response.data[i].images.fixed_height.url)
            newImg.attr("data-still", response.data[i].images.fixed_height_still.url)
            newImg.attr("src", response.data[i].images.fixed_height_still.url);

            newDiv.prepend(newImg, newTitle, newRating);
            $("#favorites").prepend(newDiv);
            j++
            loadFavorite();
        });
    }
    // }
}

loadFavorite()

$(document).on("click", ".fav", makeFavorite);

$(document).on("click", ".gif", animateGif);

$(document).on("click", ".animal-btn", displayGif);

renderButton();