$(document).ready(function(){
    $("#check").click(function(){
        var name = $('input[name="name"]').val();
        $.get("user/check",
            { name: name},
            function(result){
                if(result == true) {
                    $("#tips").addClass("text-success").removeClass("text-danger hidden").text("恭喜你,该昵称未被使用!");
                } else if(result == false){
                    $("#tips").addClass("text-danger").removeClass("text-success hidden").text("该昵称已被使用!");
                } else{
                    $("#tips").addClass("text-danger").removeClass("text-danger hidden").text(result);
                }
            });
    });

});