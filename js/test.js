module('submission test');

asyncTest('test should be possible submit the form once', 1, function(){
	var counter = 0, result = true;
	
	var myform =  $('<form action="#" id="1"><input type="text" name="post"></input><input type="submit"></input></form>');
	
	myform.prevent_multiple_submissions();
	
	myform.on('submit',function(event){
		equal(event.result, result,'first should be submmited');
	});
	
	start();
	myform.submit();
});

asyncTest('test should be possible call onBlock hook', 1, function(){
	var counter = 0, result = true;
	
	var myform =  $('<form action="#" id="1"><input type="text" name="post"></input><input type="submit"></input></form>');
	
	myform.prevent_multiple_submissions({
		timeout: 10,
		onBlock: function(form, timeout){
			equal(timeout,10, 'onBlock hook has been called!');
		}
	});
	
	start();
	myform.submit();
});

asyncTest('test should be possible call onReady hook', 1, function(){
	var counter = 0, result = true;
	
	var myform =  $('<form action="#" id="1"><input type="text" name="post"></input><input type="submit"></input></form>');
	
	myform.prevent_multiple_submissions({
		timeout: 10,		
		onReady: function(form, timeout){
			ok(true, 'onReady hook has been called!');
		}
	});
	
	start();
	myform.submit();
});

asyncTest('should be possible submit once, and blocking the rest', 3, function(){
	var counter = 0, results = [true, false, false];
	
	var myform =  $('<form action="#" id="2"><input type="text" name="post"></input><input type="submit"></input></form>');
	
	myform.prevent_multiple_submissions();
	
	myform.on('submit',function(event){
		equal(event.result, results[counter],"first should " + ((results[counter])? "":"not") + " be submmited");
		counter++;
	});
	
	start();
	myform.submit();
	myform.submit();
	myform.submit();
});

asyncTest('should be possible block one, but does not affect other forms',4, function(){
	var counter=0,j=0, results = [true, false];
	var myform =  $('<form action="#" id="3"><input type="text" name="post"></input><input type="submit"></input></form>');
	var myform2 = $('<form action="#" id="4"><input type="text" name="post"></input><input type="submit"></input></form>');
	
	myform.prevent_multiple_submissions();	
	
	myform.on('submit',function(event){
		equal(event.result, results[counter], "form 1, the submit # " + counter +"  should " + ((results[counter])? "":"not") + " be submmited");
		counter++;
	});
	
	myform2.on('submit',function(event){
		equal(event.result, undefined, "form 2, the submit # "+j+" should be submmited");
	});
	
	start();
	myform.submit();
	myform.submit();
	myform2.submit();
	myform2.submit();
});

asyncTest('does not submit if form is not valid', 4, function(){
	var i = 0, j = 0;
	var f =  $('<form action="#" id="7"><input type="text" name="post"></input><input type="submit"></input></form>');
	
	f.prevent_multiple_submissions({
		before: function(x){
			ok(true, "should call validator # " + i++);	
			return false;
		}
	});
	
	f.on('submit',function(event){
		equal(event.result, false,"the submit # " + j++ + " should not be submmited");
	});

	f.submit();
	f.submit();
	start();	
}); 

asyncTest('does not call after twice', 3, function(){
	var i = 0, j = 0;
	var f =  $('<form action="#" id="7"><input type="text" name="post"></input><input type="submit"></input></form>');
	
	f.prevent_multiple_submissions({
		after: function(x){
			ok(true, "should call after once");	
			return false;
		}
	});
	
	f.on('submit',function(event){
		equal(event.result, false,"the submit # " + j++ + " should not be submmited");
	});

	f.submit();
	f.submit();
	start();	
}); 


asyncTest('should be possible control more than one form',4, function(){
	var counter=0, counter2=0, results = [true, false];
	var myform =  $('<form action="#" id="5"><input type="text" name="post"></input><input type="submit"></input></form>');
	var myform2 = $('<form action="#" id="6"><input type="text" name="post"></input><input type="submit"></input></form>');
	
	myform.prevent_multiple_submissions();
	myform2.prevent_multiple_submissions();	
	
	myform.on('submit',function(event){
		equal(event.result, results[counter],"in form 1, the submit # " +counter+ " should " + ((results[counter])? "":"not") + " be submmited");
		counter++;
	});
	
	myform2.on('submit',function(event){
		equal(event.result, results[counter2],"in form 2, the submit # " +counter2 + " should " + ((results[counter2])? "":"not") + " be submmited");
		counter2++;
	});
	
	myform.submit();
	myform.submit();
	
	myform2.submit();
	myform2.submit();
	
	start();
});

asyncTest('does submit a form twice if the timeout is reached', 3, function(){
	var counter = 0, results = [true, true, false];
	var myform =  $('<form action="#" id="8"><input type="text" name="post"></input><input type="submit"></input></form>');
	myform.prevent_multiple_submissions({
		timeout: 100
	});
	
	myform.on('submit',function(event){
		equal(event.result, results[counter],"the submit # " +counter++ + " should " + ((results[counter])? "":"not") + " be submmited");
	});
	
	myform.submit();
	setTimeout(function(){
		myform.submit();
		myform.submit();
		start();	
	},500);
});

test('test type', 1, function () {
	var myform =  $('<form action="#" id="9"><input type="text" name="post"></input><input type="submit"></input></form>');
	
	var x = myform.prevent_multiple_submissions;
	equal(typeof(x), 'function', 'should be a function');
});
