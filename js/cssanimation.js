/**
 * @preserve CSSAnimation v0.1
 * Provides 'cssAnimationKeyframe' events for keyframe animations.
 * http://www.joelambert.co.uk/cssa
 *
 * Copyright 2011, Joe Lambert. All rights reserved
 * Free to use under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 */

var CSSAnimation = {
	version: '0.1'
};

// Locate a WebKitCSSKeyframesRule
// Modified version of code found @ http://stackoverflow.com/questions/2961544/cssrules-is-empty
CSSAnimation.find = function(a) {
	var ss = document.styleSheets;
	for (var i = ss.length - 1; i >= 0; i--) {
		var s = ss[i],
			rs = s.cssRules ? s.cssRules : s.rules;
			
		for (var j = rs.length - 1; j >= 0; j--) {
			if (rs[j].type === window.CSSRule.WEBKIT_KEYFRAMES_RULE && rs[j].name == a){
				return rs[j];
			}
		}
	}
	return null;
};

// Trigger a CSS3 Animation on a given element
/**
 * Trigger a CSS3 Animation on a given element
 * @param {DOMElement} elem The DOM Element to apply the animation to
 * @param {String} animationName The name given to the @-webkit-keyframes animation
 * @param {Integer}	duration The length of time of the animation (in milliseconds)
 * @param {Object} opts An optional set of options used to override the defaults
 */

CSSAnimation.trigger = function(elem, animationName, duration, opts) {
	var keyframes = {}, loggedKeyframes = {}, animation = null, element = elem, start = 0, options = {
		base: 5,
		easing: 'linear'
	};
	
	// Enable option setting
	for(var k in opts)
		options[k] = opts[k];
	
	// Prevent animation triggers if the animation is already playing	
	if(element.isPlaying)		
		return;
	
	// Can we find the animaition called animationName?
	animation = CSSAnimation.find(animationName);
	
	if(!animation)
		return false;
	
	// Work out the timings of keyframes
	keyframes = {};
	
	for(var i=0; i < animation.cssRules.length; i++)
	{
		var kf = animation.cssRules[i],
			name = kf.keyText,
			percentage = 0;
		
		// Work out the percentage
		name == 'from' ? percentage = 0 :
		name == 'to' ? percentage = 1 :
		percentage = name.replace('%', '') / 100;
		
		// Store keyframe for easy recall
		keyframes[(percentage*100)+'%'] = kf;
	}
	
	// Start the animation
	start = new Date().getTime();
	
	// Variables used by the runloop
	var current = percentage = roundedKey = keyframe = null,
		raiseEvent = function(keyText, elapsedTime) {
			var event = document.createEvent("Event");
			event.initEvent("cssAnimationKeyframe");
			event.keyText = keyText;
			event.elapsedTime = elapsedTime;
			element.dispatchEvent(event);
		};
	
	// Trigger the animation
	element.style.webkitAnimationDuration = duration+'ms';
	element.style.webkitAnimationTimingFunction = options.easing;
	element.style.webkitAnimationName = animationName;
	element.isPlaying = true;
	
	// Use a runloop to workout when callbacks should occur
	(function runloop(){
		current 	= new Date().getTime(); // Get the current timestamp
		percent 	= Math.floor(((current - start) / duration) * 100); // Work out the percentage of the way through the animation
		key 		= (percent - (percent % options.base))+'%'; // Round the percentage
		keyframe 	= keyframes[key];	// Check if a keyframe exists
			
		if(keyframe && !loggedKeyframes[key])
		{
			loggedKeyframes[key] = true;
			raiseEvent(key, (current-start)/1000);
		}
		
		if(percent < 100)	
			requestAnimFrame(runloop, element);
		else
		{
			if(!loggedKeyframes['100%'])
				raiseEvent('100%', (current-start)/1000);
			
			// Reset the styling so it can be triggered again	
			element.style.webkitAnimationDuration = null;
			element.style.webkitAnimationTimingFunction = null;
			element.style.webkitAnimationName = null;
			
			element.isPlaying = false;
		}
	})();
};;

// requestAnimationFrame() shim by Paul Irish
// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
window.requestAnimFrame = (function() {
	return  window.requestAnimationFrame       || 
			window.webkitRequestAnimationFrame || 
			window.mozRequestAnimationFrame    || 
			window.oRequestAnimationFrame      || 
			window.msRequestAnimationFrame     || 
			function(/* function */ callback, /* DOMElement */ element){
				window.setTimeout(callback, 1000 / 60);
			};
})();;

