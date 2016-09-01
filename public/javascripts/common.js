$(document).ready(function(){
    $("#check").click(function(){
        var name = $('input[name="name"]').val();
        $.get("user/check",
            { name: name},
            function(result){
                if(result == true) {
                    $("#tips").addClass("text-success").removeClass("text-danger hidden").text("恭喜你,该笔名未被使用!");
                } else if(result == false){
                    $("#tips").addClass("text-danger").removeClass("text-success hidden").text("该笔名已被使用!");
                } else{
                    $("#tips").addClass("text-danger").removeClass("text-danger hidden").text(result);
                }
            });
    });

    $("#search").click(function(){
        var startDate = $('#startDate').val();
        var endDate = $('#endDate').val();
        var name = $('#name').val();
        var ifMember = $("#ifMember").is(':checked');

        $.getJSON("report/search",
            {
                startDate: startDate,
                endDate: endDate,
                name: name,
                ifMember: ifMember
            },
            function(result){
                setSearchResult(result);
            }
        );
    });

    function setSearchResult(data){
        $("#result tbody").empty();
        for(var i = 0; i < data.length; i++){
            $tr = $('<tr></tr>');
            $('<td>'+ (i+1) + '</td>').appendTo($tr);
            $('<td>'+ data[i].user_name + '</td>').appendTo($tr);
            $('<td>'+ data[i].title + '</td>').appendTo($tr);
            $('<td>'+ data[i].word_count + '</td>').appendTo($tr);
            $('<td>'+ data[i].date.substr(0,10) + '</td>').appendTo($tr);
            $("#result tbody").append($tr);
        }
    }
});