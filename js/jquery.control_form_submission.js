(function($)
{
	var defaults = {
		timeout: -1,              
		before: function(form){
			return true;  
		},
		after: function(form){       
			return true;             
		},
		onBlock: function(form, timeout){
			//console.log(form)
		},
		onReady: function(form){
			//console.log(form)
		}
	};

	function can_submit_based_on_number_of_submissions(self, timeout, onBlock, onReady)
	{
		var counter = $(self).data('control_form_submission_counter');
		if(typeof counter == 'undefined'){
			counter = 0;
		}
		
		if( counter == 0 && timeout > 0){
			window.setTimeout(function(){
				onReady(self);
				$(self).data('control_form_submission_counter', 0);
			}, timeout);
		}
		
		$(self).data('control_form_submission_counter', ++counter);
		
		var result = counter == 1;
		
		if (result){
			onBlock(self,timeout);
		}
		
		return result;
	}
	
    $.fn.prevent_multiple_submissions = function(options)
    {
		var hooks = $.extend({}, defaults, options);
		
		var self = this;
		self.submit(function(){
			var result = false;

			if(hooks.before(self)){
				result = can_submit_based_on_number_of_submissions(self, hooks.timeout, hooks.onBlock, hooks.onReady)
					&& hooks.after(self);
			} 

			return result;
		})
		
		return this;
    };	

})(jQuery);