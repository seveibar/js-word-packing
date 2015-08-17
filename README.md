# Javascript Simple 2D Bin Packing

This is a simply javascript library to pack 2D bins, it supported weighting locations, and was built for the purpose of building word maps where the location of the word is important (e.g. a word map overlaying a geographical map). It does not always pack all the supplied rectangles.

## Most Popular English Words Example
![Most Popular English Words (Circle)](https://raw.githubusercontent.com/seveibar/js-word-packing/master/word_circle.png)
![Most Popular English Words](https://raw.githubusercontent.com/seveibar/js-word-packing/master/word_example.png)

```html
<html>
	<head>
		<script src='binpacking.js'></script>
	</head>
	<body>
		<canvas id='canvas'></canvas>
		<script type='text/javascript'>
		// Here's the 100 most popular words in english, first is most popular
		var mostPopularWords = ["the","be","to","of","and","a","in","that","have","I","it","for","not","on","with","he","as","you","do","at","this","but","his","by","from","they","we","say","her","she","or","an","will","my","one","all","would","there","their","what","so","up","out","if","about","who","get","which","go","me","when","make","can","like","time","no","just","him","know","take","person","into","year","your","good","some","could","them","see","other","than","then","now","look","only","come","its","over","think","also","back","after","use","two","how","our","work","first","well","way","even","new","want","because","any","these","give","day","most","us"];

		var rects = [];
		for (var i = 0; i < mostPopularWords.length;i++){
			var word = mostPopularWords[i];

			// The size of the word will be a function of it's popularity
			var fontSize = 12 + Math.floor(Math.pow((100 - i)/100,4) * 96);

			// Measure the word's size
			context.font = fontSize + "px Arial";
			context.textAlign = "center";
			var wordWidth = context.measureText(word).width;

			// Place all the words randomly
			var rect = new binpacking.Rect(Math.random() * 600,Math.random() * 600,wordWidth+5,fontSize+5);

			// Store some meta-information
			rect.addProperty("fontSize", fontSize);
			rect.addProperty("text", word);

			rects.push(rect);
		}

		// Draw the area that the rects will show up in
		area.draw(context);

		// Draw the rects in their initial position
		for (var i = 0; i < rects.length;i++){
			rects[i].draw(context);
		}

		// Fade all the previous drawings to show that they are just the initial positions
		context.globalAlpha = .7;
		context.fillStyle = "#fff";
		context.fillRect(0,0,canvas.width, canvas.height);

		var placedRects = binpacking.pack(area, rects, 10);

		// Draw the rects in their final position
		context.globalAlpha = 1;
		for (var i = 0; i < placedRects.length;i++){
			placedRects[i].draw(context);
		}

		// Draw the text into each rect
		context.fillStyle = "#000";
		for (var i = 0;i < placedRects.length;i++){
			var fontSize = placedRects[i].getProperty("fontSize");
			context.font = fontSize + "px Arial";
			context.fillText(placedRects[i].getProperty("text"), placedRects[i].x, placedRects[i].y + fontSize/4);
		}

		</script>
	</body>
</html>

```