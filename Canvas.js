class Canvas{
    
    constructor(width, height, imgUrl){
        this.width = width;
        this.height = height;
        this.imgUrl = imgUrl;
    }


    render(canvas){
    ctx = canvas.getContext("2d");
    
    canvas.width = this.width; //550;
    canvas.height = this.height;//550;
    
    let background = new Image();
    background.src = this.imgUrl;
    
    // Make sure the image is loaded first otherwise nothing will draw.
    background.onload = function(){
        ctx.drawImage(background,0,0);
    }
}

}