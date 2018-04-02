'use strict';

var meeting;
var host = HOST_ADDRESS; // HOST_ADDRESS gets injected into room.ejs from the server side when it is rendered
var uid=USER_ID;
var profession;
var checkprof=CHECK_ID;
var name=NAME;
//console.log(uid);



$( document ).ready(function() {
	/////////////////////////////////
	// CREATE MEETING
	/////////////////////////////////
             
  
        
        
        meeting = new Meeting(host);
        

    
        	meeting.onLocalVideo(function(stream) {
	        //alert(stream.getVideoTracks().length);
	        document.querySelector('#localVideo').src = window.URL.createObjectURL(stream);
	        
	        $("#micMenu").on("click",function callback(e) {
				toggleMic();
    		});
    		
    		$("#videoMenu").on("click",function callback(e) {
				toggleVideo();
    		});

			$("#localVideo").prop('muted', true);

	    }
	);
        meeting.onRemoteVideo(function(stream, participantID,check,name) {
	        //alert(check);
                addRemoteVideo(stream, participantID,check,name);
                
	    }
	);
	
	meeting.onParticipantHangup(function(participantID) {
			// Someone just left the meeting. Remove the participants video
			removeRemoteVideo(participantID);
		}
	);
    
    meeting.onChatReady(function() {
			console.log("Chat is ready");
	    }
	);
        
        
   
////        
//        if(check=="professor")
//{
//        if (sessionStorage.getItem("is_reloaded"))
//            {alert(' Reloaded!');
//                sessionStorage.clear();
//              
//                //window.close();
//                 meeting.goodbye(uid) ;
//                
//               
//                  
//                
//            }
//
////            else{
//               sessionStorage.setItem("is_reloaded",true); }
//            
//            
//       
//        
//        
//	
//	
//
//	
//	
////            try{
////	meeting.goodbye(uid);
////            }catch(err){
////                console.log("user not joined");
////            }
//// 
//    var room = window.location.pathname.match(/([^\/]*)\/*$/)[1];
//    
//    
////    
////    $('#connect').click(function() { 
////   
////   meeting.joinRoom(room,uid,check); 
////});
//
//
//
//
////    if(check=="loggedout")
//// {
////meeting.hangup(uid);
//	meeting.joinRoom(room,uid,check);
//// }
////else{
////    console.log("already logged in")
//// 
////   
////} 
//            }
//} else{
 var room = window.location.pathname.match(/([^\/]*)\/*$/)[1];
    

	meeting.joinRoom(room,uid,checkprof,name);
                
            //}   
}); // end of document.ready



function addRemoteVideo(stream, participantID,check,name) {
    
   // var profess=getprof(participantID);
    //console.log("mess"+profess)
    putvideo(stream,participantID,check,name);
//    var $videoBox = $("<div class='videoWrap' id='"+participantID+"'></div>");
//    var $video = $("<video class='videoBox' autoplay></video><p id='para"+participantID+"' >Loading..</p><p>"+"HI"+"</p>");
// 
//    $video.attr({"src": window.URL.createObjectURL(stream), "autoplay": "autoplay"});
//    $videoBox.append($video);
//	$("#videosWrapper").append($videoBox);
// 
//	adjustVideoSize();
	
}




function removeRemoteVideo(participantID) {
	$("#"+participantID).remove();
	adjustVideoSize();
}

function adjustVideoSize() {
	var numOfVideos = $(".videoWrap").length; 
	if (numOfVideos>2) {
		var $container = $("#videosWrapper");
		var newWidth;
		for (var i=1; i<=numOfVideos; i++) {
			newWidth = $container.width()/i;
			
			// check if we can start a new row
			var scale = newWidth/$(".videoWrap").width();
			var newHeight = $(".videoWrap").height()*scale;
			var columns = Math.ceil($container.width()/newWidth);
			var rows = numOfVideos/columns;
			
			if ((newHeight*rows) <= $container.height()) {
				break;
			}
		}
		
		var percent = (newWidth/$container.width())*100;
		$(".videoWrap").css("width", percent-5+"%");
		$(".videoWrap").css("height", "auto"); 

		
		//var numOfColumns = Math.ceil(Math.sqrt(numOfVideos));
		var numOfColumns;
		for (var i=2; i<=numOfVideos; i++) {
			if (numOfVideos % i === 0) {
				numOfColumns = i;
				break;
			}
		}
	    $('#videosWrapper').find("br").remove();
		$('.videoWrap:nth-child('+numOfColumns+'n)').after("<br>");
	} else if (numOfVideos == 2) {
		$(".videoWrap").width('auto');
		$("#localVideoWrap").css("width", 20+"%");
		$('#videosWrapper').find("br").remove();
	} else {
		$("#localVideoWrap").width('auto');
		$('#videosWrapper').find("br").remove();
	}
}


function putvideo(stream,id,check,name){

  
 
                        if(check=="professor")
                            {
                         
                         var $videoBox = $("<div class='profvideoWrap' id='"+id+"'></div>");
    var $video = $("<video class='profvideoBox col-md-12' autoplay></video>");
    var $para=$("<div class='profpara'><p  id='para"+id+"' >Professor: "+name+"</p></div>");
 
    $video.attr({"src": window.URL.createObjectURL(stream), "autoplay": "autoplay"});
    $videoBox.append($video);
     $videoBox.append($para);
	$(".profvideopane").append($videoBox);
       // adjustVideoSize();
                            }
                            else
                                {
                                    var $outpadded=$("<div class='outpadded' id='"+id+"'></div>");
                                    var $paddedbox=$("<div class='padded'></div>");
                                        var $videoBox = $("<div class='studvideoWrap' id='"+id+"'></div>");
    var $video = $("<video class='studvideoBox' autoplay></video>");
 
    $video.attr({"src": window.URL.createObjectURL(stream), "autoplay": "autoplay"});
   var $para=$("<p id='para"+id+"' >Student: "+name+"</p>")
    $videoBox.append($video);
    $videoBox.append($para);
    $paddedbox.append($videoBox);
     $outpadded.append($paddedbox);
	$(".studvideopane").append($outpadded);
       // adjustVideoSize();
                                }
                    
               
         
    
}

