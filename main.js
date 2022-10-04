$(function(){
    setInterval(myTimer,1000); // 1초마다 호출되게 한다.

    function myTimer(){
      let today = new Date(); //데이트객체생성
      let y=today.getFullYear();
      let m=today.getMonth()+1;
      let d=today.getDate();
      let day=today.getDay();
      let weekday = new Array(7);
      weekday[0] = "Sunday";
      weekday[1] = "Monday";
      weekday[2] = "Tuesday";
      weekday[3] = "Wednesday";
      weekday[4] = "Thursday";
      weekday[5] = "Friday";
      weekday[6] = "Saturday";

      let t_time = today.toLocaleTimeString();

      $(".today-time .year").text(y);
      $(".today-time .month").text(m);
      $(".today-time .date").text(d);
      $(".day").text(weekday[today.getDay()]);
      $(".today-time .todayTimes").text(t_time);
    }

    let taskInput = $("#w-city"); // input값을 할당.

    taskInput.on("keyup", function(event){
        if(event.keyCode===13){
           
            taskInput.value="";
        }
    });


});



// 현재 날씨
$.getJSON("https://api.openweathermap.org/data/2.5/weather?lat=37.5666805&lon=126.9784147&appid=1255e4aac90af2ff4a1905e43962ab4b&units=metric", function(result){
    
// 현재온도
    $(".temp").append(result.main.temp); //현재온도
    $(".max").append(result.main.temp_min); //최고온도
    $(".min").append(result.main.temp_max); //최저온도
    $(".wind").append(result.wind.speed); //바람
    $(".clouds").append(result.clouds.all); //구름
    $(".city").append(result.name); //도시이름

    // 현재온도 아이콘
    let wiconUrl = '<img src="http://openweathermap.org/img/wn/'+result.weather[0].icon+'.png" alt="'+result.weather[0].description+'">';
    $(".today-icon").html(wiconUrl);
});


// 미래 날씨 5일 3시간씩.
$.getJSON("https://api.openweathermap.org/data/2.5/forecast?lat=37.5666805&lon=126.9784147&appid=1255e4aac90af2ff4a1905e43962ab4b&units=metric",function(result){
    
    for(let i=0; i<39; i++){
        let ctime = result.list[i].dt;
        let ctemp = result.list[i].main.temp;
    
        function convertTime(t){
            let ot = new Date(t*1000);
            
            let dt = ot.getDate();
            let hr = ot.getHours();
            let m = ot.getMinutes();
            let s = ot.getSeconds();
    
            return dt+ "일" + hr + ":" + m + ":" + s;
        }
        let currentTime = convertTime(ctime);
        let tableHtml = '<tr>' +
                            '<td>'+currentTime+'</td>'+
                            '<td>'+ctemp+'</td>'+
                        '</tr>';
        
        $(".forecast-weather").append(tableHtml);
    };

});