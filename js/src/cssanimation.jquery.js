(function(){
	/**
	 * jQuery wrapper function around CSSAnimation.trigger()
	 * @param {String} animationName The name given to the @-webkit-keyframes animation
	 * @param {Integer}	duration The length of time of the animation (in milliseconds)
	 * @param {Object} opts An optional set of options used to override the defaults
	 */
	$.fn.cssanimation = function(animation, duration, opts) {
		return this.each(function(index, elem){
			CSSAnimation.trigger(elem, animation, duration, opts);
		});
	};
})();