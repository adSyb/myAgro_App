$(document).ready(function(){

var hrefval; var check; var distance; var sidePageWidth = "0px";

//define which side page to 'open'
$("#navigation li a").on("click", function(e){
	e.preventDefault();
	hrefval = $(this).attr("href");
	check = $("#navigation li a").hasClass("open");
	distance = sidePageWidth;

	if(hrefval == "#pay") {
		payon = true; packon = false; diston = false;
		$('#pay').css('z-index', 2);
		$('#dist').css('z-index', 1);
		sidePageWidth = '500px';
		$("#packscroll").css("display", "none");
		if (check == true && resetSwitch == true){
			$("#payscroll").css("display", "block");
		}
	}

	else if (hrefval == "#pack"){
		payon = false; packon = true; diston = false;
		$('#pay').css('z-index', 2);
		$('#dist').css('z-index', 1);
		sidePageWidth = '500px';
		$("#payscroll").css("display", "none");
		if (check == true && resetSwitch == true){
			$("#packscroll").css("display", "block");
		}
	}

	else if (hrefval == "#dist"){
		payon = false; packon = false; diston = true;
		$('#dist').css('z-index', 2);
		$('#pack').css('z-index', 1);
		sidePageWidth = '250px';
	}

 	else{
	}

	if(distance == "0px") {
		$(this).addClass("open");
		openSidepage();
	}
	else if (check == true) {
		$("#navigation li a").removeClass("open");
		$(this).addClass("open");
		adjustSidepage();
	}
	else {
	}
}); // end menu click handler

//close button handler
$("#closebtn").on("click", function(e){
	e.preventDefault();
	payon = false; packon = false; diston = false;
	closeSidepage();
});

function openSidepage() {
	$('#mainpage').animate({
		left: sidePageWidth
	}, 200, 'easeOutBack');
	$('#base').animate({
		left: '80px',
		right: sidePageWidth
	}, 200, 'easeOutBack');
}

function adjustSidepage(){
	$('#mainpage').animate({
		left: sidePageWidth
	}, 200, 'easeOutQuint');
	$('#base').animate({
		left: '80px',
		right: sidePageWidth
	}, 200, 'easeOutQuint');
}
  
function closeSidepage(){
	$("#navigation li a").removeClass("open");
	sidePageWidth = "0px";
	$('#mainpage').animate({
		left: sidePageWidth
	}, 200, 'easeOutQuint');
	$('#base').animate({
		left: '250px',
		right: "0px"
	}, 200, 'easeOutQuint');
}

});