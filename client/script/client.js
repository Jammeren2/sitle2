$(document).ready(function() {
    $("button").on("click", async function () {
        var nickname = $("#nicknameInput").val();
        var response = await $.ajax({
            type: "POST",
            url: "/search",
            contentType: "application/json",
            data: JSON.stringify({ nickname: nickname })
        });

        $("#statsOutput").html(response.playerStats);
        $("#table1").html(response.clanStats);

        // Удаление элементов с классом ratingBattles из таблицы #table1
        $("#table1 .ratingBattles").remove();
        $(".table11").css("background-color", "rgba(204,204,204,1)");
        $(".table11").css("background-image", "url(images/bg\\ table.png)");

    });
});
