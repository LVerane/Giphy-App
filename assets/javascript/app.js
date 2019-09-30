var animals = ["cat", "dog", "zebra", "lion", "wolf"];

var position = 0;

function renderButton(){
    for(i=position; i<animals.length; i++){
        $("#buttons-view").append($(`<button class=animal-btn data-name=${animals[i]}>${animals[i]}</button>`));
        position++;
    }
}

$("#add-gif").on("click", function(event) {

    event.preventDefault();

    newAnimal = $("#gif-input").val().trim();
    console.log(newAnimal);

    animals.push(newAnimal);

    $("#gif-input").val("");

    renderButton();
  });

  
  function displayGif(){
    var gif = $(this).attr("data-name");
    var queryURL = "https://api.giphy.com/v1/gifs/search?api_key=EOZ19rTF7jEoLoW62HdEMAhgfmg0Ajlc&limit=10&q=" + gif;

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {
        console.log(response.data[0].url);
        console.log(response);

        // for(i=0; i<response.data.length; i++){
            var newImg = $(`<img src=${response.data[0].source}>`);
            var gifSource = response.data[0].source
            console.log(gifSource)
            // newImg.attr("src", gifSource);

            // $("<p>").text(response.data.rating)
            // newImg.attr("src", response.data.image_original_url);


        //   $("#animalGifs").append("<p>" + response.data.image_original_url + "</p>")
            $("#animalGifs").append(newImg);
        // }
    });

}

$(document).on("click", ".animal-btn", displayGif);

renderButton();