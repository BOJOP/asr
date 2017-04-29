// Global UI elements:
//  - responses: event responses
//  - trans: transcription window

// Global objects:
//  - isConnected: true iff we are connected to a worker
//  - tt: simple structure for managing the list of hypotheses
//  - dictate: dictate object with control methods 'init', 'startListening', ...
//       and event callbacks onResults, onError, ...
var isConnected = false;

var tt = new Transcription();

var startPosition = 0;
var endPosition = 0;
var doUpper = false;
var doPrependSpace = true;

var stateConfirm;
var statusConfirm = false;

var dayWord = {
	1: "Monday",
	2: "Tuesday",
	3: "Wednesday",
	4: "Thrusday",
	5: "Friday",
	6: "Saturday",
	7: "Sunday"
}

var typeOfwordArray = [
[ "เพิ่ม", "command"],
[ "เพิ่ม นัด", "command"],
[ "นัด", "command"],
[ "สร้าง งาน", "command"],
[ "แจ้ง เตือน", "command"],
[ "ยกเลิก", "command"],
[ "ยกเลิก นัด", "command"],
[ "มี นัด อะไร บ้าง", "question"],
[ "มี งาน อะไร บ้าง", "question"],
[ "เรียง นัด ทั้งหมด ของ", "question"],
[ "กินข้าว", "activity"],
[ "ส่ง งาน", "activity"],
[ "ประชุม", "activity"],
[ "เพื่อน คุย งาน ", "activity"],
[ "ประชุม", "activity"],
[ "ส่ง รายงาน", "activity"],
[ "ทุก รายการ", "activity"],
[ "กินข้าว", "activity"],
[ "ประชุม", "activity"],
[ "เพื่อน", "activity"],
[ "ทำงาน", "activity"],
[ "นำเสนอ โปรเจค", "activity"],
[ "ดู ซีรีย์", "activity"],
[ "ไป เรียนพิเศษ", "activity"],
[ "เมื่อวาน", "day"],
[ "วันนี้", "day"],
[ "พรุ่งนี้", "day"],
[ "มะรืนนี้", "day"],
[ "วัน จันทร์", "day"],
[ "วัน อังคาร", "day"],
[ "วัน พุธ", "day"],
[ "วัน พฤหัส", "day"],
[ "วัน ศุกร์", "day"],
[ "วัน เสาร์", "day"],
[ "วัน อาทิตย์", "day"],
[ "ตี หนึ่ง", "time"],
[ "ตี หนึ่ง ครึ่ง", "time"],
[ "ตี สอง", "time"],
[ "ตี สอง ครึ่ง", "time"],
[ "ตี สาม", "time"],
[ "ตี สาม ครึ่ง", "time"],
[ "ตี สี่", "time"],
[ "ตี สี่ ครึ่ง", "time"],
[ "ตี ห้า", "time"],
[ "ตี ห้า ครึ่ง", "time"],
[ "หก โมง", "time"],
[ "หก โมง ครึ่ง", "time"],
[ "เจ็ด โมง", "time"],
[ "เจ็ด โมง ครึ่ง", "time"],
[ "แปด โมง", "time"],
[ "แปด โมง ครึ่ง", "time"],
[ "เก้า โมง", "time"],
[ "เก้า โมง ครึ่ง", "time"],
[ "สิบ โมง", "time"],
[ "สิบ โมง ครึ่ง", "time"],
[ "สิบ เอ็ด โมง", "time"],
[ "สิบ เอ็ด โมง ครึ่ง", "time"],
[ "เที่ยง", "time"],
[ "เที่ยง ครึ่ง", "time"],
[ "บ่าย โมง", "time"],
[ "บ่าย โมง ครึ่ง", "time"],
[ "บ่าย สอง", "time"],
[ "บ่าย สอง ครึ่ง", "time"],
[ "บ่าย สาม", "time"],
[ "บ่าย สาม ครึ่ง", "time"],
[ "สี่ โมง ", "time"],
[ "สี่ โมง ครึ่ง", "time"],
[ "ห้า โมง", "time"],
[ "ห้า โมง ครึ่ง", "time"],
[ "หก โมง", "time"],
[ "หก โมง ครึ่ง", "time"],
[ "หนึ่ง ทุ่ม", "time"],
[ "หนึ่ง ทุ่ม ครึ่ง", "time"],
[ "สอง ทุ่ม", "time"],
[ "สอง ทุ่ม ครึ่ง", "time"],
[ "สาม ทุ่ม", "time"],
[ "สาม ทุ่ม ครึ่ง", "time"],
[ "สี่ ทุ่ม", "time"],
[ "สี่ ทุ่ม ครึ่ง", "time"],
[ "ห้า ทุ่ม", "time"],
[ "ห้า ทุ่ม ครึ่ง", "time"],
[ "เที่ยงคืน", "time"],
[ "เที่ยงคืน ครึ่ง", "time"]	
];

var idOfWordArray = [
	[ "เพิ่ม", 1],
[ "เพิ่ม นัด", 1],
[ "นัด", 1],
[ "สร้าง งาน", 1],
[ "แจ้ง เตือน", 1],
[ "ยกเลิก", 2],
[ "ยกเลิก นัด", 2],
[ "มี นัด อะไร บ้าง", 3],
[ "มี งาน อะไร บ้าง", 3],
[ "เรียง นัด ทั้งหมด ของ", 3],
[ "กินข้าว", 4],
[ "ส่ง งาน", 4],
[ "ประชุม", 4],
[ "เพื่อน คุย งาน ", 4],
[ "ประชุม", 4],
[ "ส่ง รายงาน", 4],
[ "ทุก รายการ", 4],
[ "กินข้าว", 4],
[ "ประชุม", 4],
[ "เพื่อน", 4],
[ "ทำงาน", 4],
[ "นำเสนอ โปรเจค", 4],
[ "ดู ซีรีย์", 4],
[ "ไป เรียนพิเศษ", 4],
[ "เมื่อวาน", 5],
[ "วันนี้", 6],
[ "พรุ่งนี้", 7],
[ "มะรืนนี้", 8],
[ "วัน จันทร์", 9],
[ "วัน อังคาร", 10],
[ "วัน พุธ", 11],
[ "วัน พฤหัส", 12],
[ "วัน ศุกร์", 13],
[ "วัน เสาร์", 14],
[ "วัน อาทิตย์", 15],
[ "เที่ยงคืน ครึ่ง", 16],
[ "ตี หนึ่ง", 17],
[ "ตี หนึ่ง ครึ่ง", 18],
[ "ตี สอง", 19],
[ "ตี สอง ครึ่ง", 20],
[ "ตี สาม", 21],
[ "ตี สาม ครึ่ง", 22],
[ "ตี สี่", 23],
[ "ตี สี่ ครึ่ง", 24],
[ "ตี ห้า", 25],
[ "ตี ห้า ครึ่ง", 26],
[ "หก โมง", 27],
[ "หก โมง ครึ่ง", 28],
[ "เจ็ด โมง", 29],
[ "เจ็ด โมง ครึ่ง", 30],
[ "แปด โมง", 31],
[ "แปด โมง ครึ่ง", 32],
[ "เก้า โมง", 33],
[ "เก้า โมง ครึ่ง", 34],
[ "สิบ โมง", 35],
[ "สิบ โมง ครึ่ง", 36],
[ "สิบ เอ็ด โมง", 37],
[ "สิบ เอ็ด โมง ครึ่ง", 38],
[ "เที่ยง", 39],
[ "เที่ยง ครึ่ง", 40],
[ "บ่าย โมง", 41],
[ "บ่าย โมง ครึ่ง", 42],
[ "บ่าย สอง", 43],
[ "บ่าย สอง ครึ่ง", 44],
[ "บ่าย สาม", 45],
[ "บ่าย สาม ครึ่ง", 46],
[ "สี่ โมง ", 47],
[ "สี่ โมง ครึ่ง", 48],
[ "ห้า โมง", 49],
[ "ห้า โมง ครึ่ง", 50],
[ "หก โมง", 51],
[ "หก โมง ครึ่ง", 52],
[ "หนึ่ง ทุ่ม", 53],
[ "หนึ่ง ทุ่ม ครึ่ง", 54],
[ "สอง ทุ่ม", 55],
[ "สอง ทุ่ม ครึ่ง", 56],
[ "สาม ทุ่ม", 57],
[ "สาม ทุ่ม ครึ่ง", 58],
[ "สี่ ทุ่ม", 59],
[ "สี่ ทุ่ม ครึ่ง", 60],
[ "ห้า ทุ่ม", 61],
[ "ห้า ทุ่ม ครึ่ง", 62],
[ "เที่ยงคืน", 63],
];

var template = [
	["command", "activity", "day", "time"],
	["day", "question"]
];

var typeOfword = new Map(typeOfwordArray);
var idOfWord = new Map(idOfWordArray);


function capitaliseFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function prettyfyHyp(text, doCapFirst, doPrependSpace) {
	if (doCapFirst) {
		text = capitaliseFirstLetter(text);
	}
	tokens = text.split(" ");
	text = "";
	if (doPrependSpace) {
		text = " ";
	}
	doCapitalizeNext = false;
	tokens.map(function(token) {
		if (text.trim().length > 0) {
			text = text + " ";
		}
		if (doCapitalizeNext) {
			text = text + capitaliseFirstLetter(token);
		} else {
			text = text + token;
		}
		if (token == "." ||  /\n$/.test(token)) {
			doCapitalizeNext = true;
		} else {
			doCapitalizeNext = false;
		}
	});

	text = text.replace(/ ([,.!?:;])/g,  "\$1");
	text = text.replace(/ ?\n ?/g,  "\n");
	return text;
}


var dictate = new Dictate({
		server : $("#servers").val().split('|')[0],
		serverStatus : $("#servers").val().split('|')[1],
		recorderWorkerPath : './lib/recorderWorker.js',
		onReadyForSpeech : function() {
			isConnected = true;
			__message("READY FOR SPEECH");
			$("#buttonToggleListening").html('Stop');
			$("#buttonToggleListening").addClass('highlight');
			$("#buttonToggleListening").prop("disabled", false);
			$("#buttonCancel").prop("disabled", false);
			startPosition = $("#trans").prop("selectionStart");
			endPosition = startPosition;
			var textBeforeCaret = $("#trans").val().slice(0, startPosition);
			if ((textBeforeCaret.length == 0) || /\. *$/.test(textBeforeCaret) ||  /\n *$/.test(textBeforeCaret)) {
				doUpper = true;
			} else {
				doUpper = false;
			}
			doPrependSpace = (textBeforeCaret.length > 0) && !(/\n *$/.test(textBeforeCaret));
		},
		onEndOfSpeech : function() {
			__message("END OF SPEECH");
			$("#buttonToggleListening").html('Stopping...');
			$("#buttonToggleListening").prop("disabled", true);
		},
		onEndOfSession : function() {
			isConnected = false;
			__message("END OF SESSION");
			$("#buttonToggleListening").html('Start');
			$("#buttonToggleListening").removeClass('highlight');
			$("#buttonToggleListening").prop("disabled", false);
			$("#buttonCancel").prop("disabled", true);
		},
		onServerStatus : function(json) {
			__serverStatus(json.num_workers_available);
			$("#serverStatusBar").toggleClass("highlight", json.num_workers_available == 0);
			// If there are no workers and we are currently not connected
			// then disable the Start/Stop button.
			if (json.num_workers_available == 0 && ! isConnected) {
				$("#buttonToggleListening").prop("disabled", true);
			} else {
				$("#buttonToggleListening").prop("disabled", false);
			}
		},
		onPartialResults : function(hypos) {
			hypText = prettyfyHyp(hypos[0].transcript, doUpper, doPrependSpace);
			val = $("#trans").val();
			$("#trans").val(val.slice(0, startPosition) + hypText + val.slice(endPosition));
			endPosition = startPosition + hypText.length;
			$("#trans").prop("selectionStart", endPosition);
		},
		onResults : function(hypos) {
			hypText = prettyfyHyp(hypos[0].transcript, doUpper, doPrependSpace);
			val = $("#trans").val();
			$("#trans").val(val.slice(0, startPosition) + hypText + val.slice(endPosition));
			startPosition = startPosition + hypText.length;
			endPosition = startPosition;
			$("#trans").prop("selectionStart", endPosition);
			if (/\. *$/.test(hypText) ||  /\n *$/.test(hypText)) {
				doUpper = true;
			} else {
				doUpper = false;
			}
			doPrependSpace = (hypText.length > 0) && !(/\n *$/.test(hypText));
		},
		onError : function(code, data) {
			dictate.cancel();
			__error(code, data);
			// TODO: show error in the GUI
		},
		onEvent : function(code, data) {
			__message(code, data);
		}
	});


function convertToObject(json) {
	return JSON.parse(json);
}

function checkTemplate(state) {
	for(var i=0;i<template.length;i++){
		var chk = 0;
		for(var j=0;j<template[i].length;j++){
			if(!state.get(template[i][j])){
				chk = 1;
				break;
			}
		}
		if(!chk)
			return i;
	}
	return -1;
}

function to_time(i){
	return Math.floor((i/2)).toString() + ((i%2)==0?":00":":30");
}
	
function processSentence(sentence) {

	var words = sentence.split(" ");
	words[words.length-1] = words[words.length-1].substring(0, words[words.length-1].length-1);
	var state = new Map();
	
	for(var start=0;start<words.length;start++){
		for(var end=words.length;end>start;end--){
			var word = words.slice(start,end).join(" ");
			
			var type = typeOfword.get(word);
			if(type) {
				state.set(type,{
					id: idOfWord.get(word),
					start: start,
					end: end
				});
				start = end-1;
			}
		}
	}

	var idTemplate = checkTemplate(state);

	var clearStatusConfirm = true;
	
	$('#modal-confirm').modal('hide dammer');
	$('#modal-detail').modal('hide dammer');

	if(idTemplate >= 0) {
		
		
		//template => command activity day time
		if(idTemplate == 0) {
			var command = state.get("command")["id"];
			var activityId = state.get("activity")["id"];
			var activity = words.slice(state.get("activity")["start"],state.get("activity")["end"]).join("");
			var day = state.get("day")["id"]-8;
			var time = state.get("time")["id"]-15;

			//add activity
			if(command == 1){

				$('#' + time + "_" + day).append(
					  "<div class='event " + activityId + "'>"
					+ "	 <div class='description'>"
					+ activity
					+ "	 </div>"
					+ "</div>"
				);
								
			}
			
			//delete activity
			if(command == 2){
				var stateTemp = {
					command: command,
					activtiy: activityId,
					day: day,
					time: time,
				}

				if(statusConfirm && JSON.stringify(stateConfirm) == JSON.stringify(stateTemp)) {
					$('#' + time + "_" + day).find("." + activityId).remove();
				} else {
					var message_alert = "You don't have '" + activity + "' at " + dayWord[day] + " " + to_time(time) + ".";
					
					if($('#' + time + "_" + day).find("." + activityId).length > 0) {				
						statusConfirm = true;
						clearStatusConfirm = false;
						stateConfirm = stateTemp;
						message_alert = "If you want to remove '" + activity + "' from " + dayWord[day] + " " + to_time(time) + ", please speak it again.";
					}
					
					$('#message-confirm').html(message_alert);
					$('#modal-confirm').modal('show');
				}
			}

		}
		
		//template => question and day
		if(idTemplate == 1) {
			
			var command = state.get("command")["id"];
			var day = state.get("day")["id"]-8;
			
			//TODO: (TEST) list all activity
			if(command == 3) {
			
				var message_alert = "";
				
				for(var i=1;i<=48;i++){
					message_alert += "<h5>";
					$("#" + i + "_" + j).find('.description').each(function( index ) {
						if(index == 0)
							message_alert += to_time(i) + " => " + $( this ).text();
						else
							message_alert += ", " + $( this ).text();
					});
					message_alert += "</h5>";
				}
			
				$('#message-detail').html(message_alert);				
				$('#modal-detail').modal('show');
			}
		}
		
	}
	
	if(clearStatusConfirm) {
		statusConfirm = false;
		stateConfirm = {};
	}
	
	state.clear();
}
	
function process(data){
	var response = convertToObject(data);
	
	if(response["result"] && response["result"]["final"]){
		try {
			
			var sentence = response["result"]["hypotheses"][0]["transcript"];
			processSentence(sentence);
			
		} catch (err) {
			
			return false;

		}
	}
}
	
// Private methods (called from the callbacks)
function __message(code, data) {
	var responses = $('#responses');
	responses.html("msg: " + code + ": " + (data || '') + "\n" + responses.html());

	if(code==8) {
		process(data);
	}
}

function __error(code, data) {
	var responses = $('#responses');
	responses.html("ERR: " + code + ": " + (data || '') + "\n" + responses.html());
}

function __serverStatus(msg) {
	serverStatusBar.innerHTML = msg;
}

function __updateTranscript(text) {
	$("#trans").val(text);
}

// Public methods (called from the GUI)
function toggleListening() {
	if (isConnected) {
		dictate.stopListening();
	} else {
		dictate.startListening();
	}
}

function cancel() {
	dictate.cancel();
}

function clearTranscription() {
	$("#trans").val("");
	// needed, otherwise selectionStart will retain its old value
	$("#trans").prop("selectionStart", 0);
	$("#trans").prop("selectionEnd", 0);
}

$(document).ready(function() {
  dictate.init();

  //dictate.cancel();
  //var servers = $("#servers").val().split('|');
	//dictate.setServer(servers[0]);
	//dictate.setServerStatus(servers[1]);

});
