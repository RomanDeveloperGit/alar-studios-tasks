const rad = Math.PI / 180;

const canvases = {
	starContainer: document.querySelector( ".stars-canvas" ),
	colorBox: document.querySelector( ".color-canvas" )
};

const canvasContexts = {
	starContainer: canvases.starContainer.getContext( "2d" ),
	colorBox: canvases.colorBox.getContext( "2d" )
};

const defaultStarPointOffsetX = 100;
const defaultStarPointOffsetY = 100;

const starsData = [
	{
		color: "#FF0000",
		offsetX: 0,
		offsetY: 0
	},
	{
		color: "#0000FF",
		offsetX: 200,
		offsetY: 0
	},
	{
		color: "#00FF00",
		offsetX: 400,
		offsetY: 0
	},
	{
		color: "#FFFF00",
		offsetX: 0,
		offsetY: 200
	},
	{
		color: "#000000",
		offsetX: 200,
		offsetY: 200
	},
];

const setCanvasBackground = ( canvas, canvasContext, color = "#FFFFFF" ) => {
	canvasContext.fillStyle = color;
	canvasContext.fillRect( 0, 0, canvas.width, canvas.height );
};

const createCanvasStars = ( context, color, offsetX = 0, offsetY = 0 ) => {
	if (!context || !color) return;
	
	offsetX = offsetX + defaultStarPointOffsetX;
	offsetY = offsetY + defaultStarPointOffsetY;
	
	context.beginPath();
 
	for (let i = 0; i < 5; i++) {
		context.lineTo( Math.cos( ( 18 + i * 72 ) * rad ) * 60 + offsetX, -Math.sin( ( 18 + i * 72 ) * rad ) * 60 + offsetY );
		context.lineTo( Math.cos( ( 54 + i * 72 ) * rad ) * 20 + offsetX, -Math.sin( ( 54 + i * 72 ) * rad ) * 20 + offsetY );
	}

	context.closePath();

	context.fillStyle = color;
	context.fill();
};


setCanvasBackground( canvases.starContainer, canvasContexts.starContainer );

starsData.forEach( item => {
	createCanvasStars( canvasContexts.starContainer, item.color, item.offsetX, item.offsetY );
});

canvases.starContainer.addEventListener( "click", event => {
	const { 0: r, 1: g, 2: b, 3: a } = canvasContexts.starContainer.getImageData( event.layerX, event.layerY, 1, 1 ).data;

	setCanvasBackground( canvases.colorBox, canvasContexts.colorBox, `rgba( ${r}, ${g}, ${b}, ${a} )` );
});