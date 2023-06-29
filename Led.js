class Led  {

    pixeles = [];
	
	xMinima = 0;
	xMaxima = 0;
	yMinima = 0;
	yMaxima = 0;

    //Counter = 0;
	
	constructor(x, y)  {
	
		this.agregarpixel(x, y);
		this.xMinima = x;
		this.xMaxima = x;
		this.yMinima = y;
		this.yMaxima = y;
	}

    agregarpixel(x, y)  {
		
		this.pixeles.push( {x: x, y: y} );
		
		if(x < this.xMinima)  {
			
			this.xMinima = x;
		}
		if(x > this.xMaxima)  {
			
			this.xMaxima = x
		}
		
		this.yMinima = y < this.yMinima ? y : this.yMinima;
		
		this.yMaxima = y > this.yMaxima ? y : this.yMaxima;

        //this.Counter = this.Counter++;
	}
}