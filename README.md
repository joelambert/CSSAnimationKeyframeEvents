# CSS3 Animation Keyframe Events
CSS3 Animations are great but the current implementation doesn't trigger Javascript Events for each Keyframe [(see here for more information)](http://blog.joelambert.co.uk/2011/05/17/keyframe-events-for-css3-animations/).

The CSSAnimation object provides the events the browser vendors left out! This allows you to bind event handlers to `cssAnimationKeyframe` events and perform any additional code that needs to happen at each keyframe.

*Note: This won't work as well on Mobile Webkit until `webkitRequestAnimationFrame()` is implemented!*

## Tested Under
- Safari 5
- Chrome (Canary/Dev Builds)

## May/should also work for
- iOS (see above caveat about Mobile WebKit)

# Requirements
A browser capable of rendering CSS3 Animations (currently just Safari/Chrome).

# Usage
Create the CSS animation keyframes in CSS as you would normally:

	@-webkit-keyframes boxrotate {
	  0% {
	    -webkit-transform: translate3d(0, 0, 0);
	    background: #da371e;
	  }

	  25% {
	    -webkit-transform: translate3d(0px, 200px, 0) rotate(90deg);
	    background: #da3ab9;
	  }

	  50% {
	    -webkit-transform: translate3d(200px, 200px, 0) rotate(180deg);
	    background: #34b6da;
	  }

	  75% {
	    -webkit-transform: translate3d(200px, 0, 0) rotate(270deg);
	    background: #88da50;
	  }

	  100% {
	    -webkit-transform: translate3d(0, 0, 0) rotate(360deg);
	    background: #da371e;
	  }
	}
	
Next trigger the animation on a specified DOM element:

	var elem = document.getElementById('animateme');
	
	// Trigger the animation named 'boxrotate' with duration 3000ms
	CSSAnimation.trigger(elem, 'boxrotate', 3000);
	
There is also a jQuery plugin provided for convenience (`cssanimation.jquery.js`):

	$('#animateme').cssanimation('boxrotate', 3000);
	
You can then listen for `cssAnimationKeyframe` events the same way you'd listen for any other. Here's an example using jQuery:

	$('#animateme').bind('cssAnimationKeyframe', function(event){
		var text = "";
		
		switch(event.originalEvent.keyText) {
			case '0%':
				text = "down &darr;"; break;
			case '25%':
				text = "right &rarr;"; break;
			case '50%':
				text = "up &uarr;"; break;
			case '75%':
				text = "left &larr;"; break;
			case '100%':
				text = "click me"; break;
		};
		
		$('#text').html(text);
	});
	
# License

CSSAnimation Keyframe Events is Copyright &copy; 2011 [Joe Lambert](http://www.joelambert.co.uk) and is licensed under the terms of the [MIT License](http://www.opensource.org/licenses/mit-license.php).