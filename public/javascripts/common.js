$(document).ready(function(){
    $("#check").click(function(){
        var name = $('input[name="name"]').val();
        $.get("user/check",
            { name: name},
            function(result){
                if(result == true) {
                    showTips("恭喜你,该笔名未被使用!");
                } else if(result == false){
                    showTips("该笔名已被使用!");
                } else{
                    showTips(result);
                }
            });
    });

    function showTips(msg){
        $("#tips").removeClass("hidden").text(msg);
        setTimeout(function(){$("#tips").addClass("hidden");}, 5000);
    }

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

    $("#record_activity").click(function(){
        var date = $("input[name='date']").val();
        if(!date || date.length === 0){
            showTips("日期选择有误");
            return;
        }
        var name = $("input[name='name']").val();
        if(!name || name.trim().length === 0){
            showTips("请输入笔名");
            return;
        }
        var title = $("input[name='title']").val();
        if(!title || title.trim().length === 0){
            showTips("请输入文章标题")
            return;
        }
        var word_count = $("input[name='word_count']").val();
        if(!word_count || title.trim().length === 0){
            word_count = 0;
        }
        var reg = /^\d+$/;
        if(!reg.test(word_count)){
            showTips("字数必须为正整数");
            return;
        }
        $.post("record-activity",
            {
                name: name,
                date: date,
                title: title,
                word_count: word_count
            },
            function(result){
                if(result.code == 2000){
                    getRecordStatistics(name);
                }else{
                    if(result.message){
                        showTips(result.message);
                    }else{
                        showTips("程序出错");
                    }
                }
            }
        );
        
    })

     $("#record").click(function(){
        var date = $("input[name='date']").val();
        if(!date || date.length === 0){
            showTips("日期选择有误");
            return;
        }
        var name = $("input[name='name']").val();
        if(!name || name.trim().length === 0){
            showTips("请输入笔名");
            return;
        }
        var title = $("input[name='title']").val();
        if(!title || title.trim().length === 0){
            showTips("请输入文章标题")
            return;
        }
        var word_count = $("input[name='word_count']").val();
        if(!word_count || title.trim().length === 0){
            word_count = 0;
        }
        var reg = /^\d+$/;
        if(!reg.test(word_count)){
            showTips("字数必须为正整数");
            return;
        }
        $.post("record",
            {
                name: name,
                date: date,
                title: title,
                word_count: word_count
            },
            function(result){
                if(result.code == 2000){
                    getRecordStatistics(name);
                }else{
                    if(result.message){
                        showTips(result.message);
                    }else{
                        showTips("程序出错");
                    }
                }
            }
        );
        
    })

    function getRecordStatistics(user){
         $.getJSON("record/"+encodeURIComponent(user),
            {},
            function(result){
                if(result && result.message){
                    showTips(result.message);
                }else{
                    setRecordResult(result);
                }
            }
        );
    }

    function setRecordResult(data){
        $("#feedback").removeClass("hidden");
        $("#continuous_count").text(data.continuousCount);
        $("#total_count").text(data.totalCount);
        $("#word_count").text(data.totalWords);
    }

    $("#confirm").click(function(){
        $("#feedback").addClass("hidden");
    })

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

    $("#undoneSearch").click(function(){
        var date = $('#date').val();

        $.getJSON("undonesearch",
            {
                date: date,
            },
            function(result){
                setUndoneResult(result);
            }
        );
    });

    function setUndoneResult(data){
        $("#result tbody").empty();
        for(var i = 0; i < data.length; i++){
            $tr = $('<tr></tr>');
            $('<td>'+ (i+1) + '</td>').appendTo($tr);
            $('<td>'+ data[i].user_name + '</td>').appendTo($tr);
            $("#result tbody").append($tr);
        }
    }
});