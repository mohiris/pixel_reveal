class Image{
    
    constructor(width, height, imgUrl){
        this.width = width;
        this.height = height;
        this.imgUrl = imgUrl;
    }


    render(){

        let elem = document.createElement('img');
        elem.width = this.width;
        elem.height = this.height;
        elem.src = this.imgUrl;

        return elem;
    }
}