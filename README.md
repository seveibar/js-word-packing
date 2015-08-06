# Javascript Simple 2D Bin Packing

This is a simply javascript library to pack 2D bins, it supported weighting locations, and was built for the purpose of building word maps where the location of the word is important (e.g. a word map overlaying a geographical map). It does not always pack all the supplied rectangles.

## Most Popular English Words Example
![Most Popular English Words](https://raw.githubusercontent.com/seveibar/js-word-packing/master/word_example.png)

```html

<html>
	<head>
		<script src='binpacking.js'></script>
	</head>
	<body>
		<canvas id='canvas'></canvas>
		<script>

		// Here's the 100 most popular words in english, first is most popular
		var mostPopularWords = ["the","be","to","of","and","a","in","that","have","I","it","for","not","on","with","he","as","you","do","at","this","but","his","by","from","they","we","say","her","she","or","an","will","my","one","all","would","there","their","what","so","up","out","if","about","who","get","which","go","me","when","make","can","like","time","no","just","him","know","take","person","into","year","your","good","some","could","them","see","other","than","then","now","look","only","come","its","over","think","also","back","after","use","two","how","our","work","first","well","way","even","new","want","because","any","these","give","day","most","us"];


		var canvas = document.getElementById("canvas");
		var context = canvas.getContext('2d');

		canvas.width = 600;
		canvas.height = 600;

		var area = new binpacking.Rect(300,300,550,550);

		var rects = [];
		for (var i = 0; i < mostPopularWords.length;i++){
			var word = mostPopularWords[i];

			// The size of the word will be a function of it's popularity
			var fontSize = 12 + Math.floor(Math.pow((100 - i)/100,8) * 96);

			// Measure the word's size
			context.font = fontSize + "px Arial";
			context.textAlign = "center";
			var wordWidth = context.measureText(word).width;

			// We'll put all the words at the center for now
			var rect = new binpacking.Rect(300,300,wordWidth+5,fontSize+5);

			// Store some meta-information
			rect.addProperty("fontSize", fontSize);
			rect.addProperty("text", word);

			rects.push(rect);
		}

		var placedRects = binpacking.pack(area, rects, 50);

		for (var i = 0;i < placedRects.length;i++){
			context.font = placedRects[i].getProperty("fontSize") + "px Arial";
			context.fillText(placedRects[i].getProperty("text"), placedRects[i].x, placedRects[i].y);
		}



		</script>
	</body>
</html>

```