var animals = ["cat", "dog", "zebra", "lion", "wolf"];

var position = 0;

function renderButton() {
    for (i = position; i < animals.length; i++) {
        $("#buttons-view").append($(`<button class=animal-btn data-name=${animals[i]}>${animals[i]}</button>`));
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

            var newImg = $(`<img data-state=still class=gif>`)
            var newP = $("<p>").text(response.data[i].rating);

            newImg.attr("data-animate", response.data[i].images.fixed_height.url)
            newImg.attr("data-still", response.data[i].images.fixed_height_still.url)
            newImg.attr("src", response.data[i].images.fixed_height_still.url);

            $("#animalGifs").prepend(newP);
            $("#animalGifs").prepend(newImg);
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

$(document).on("click", ".gif", animateGif);

$(document).on("click", ".animal-btn", displayGif);

renderButton();