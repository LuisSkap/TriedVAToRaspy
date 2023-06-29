var video;
var canvas;

var altoCamara = 720;
var anchoCamara = 720;

var amarillo = {r: 255, g: 255, b: 0};
var Lrojo = {r: 255, g: 0, b: 0, a: 255, C: 'Rojo', DistA: 180};
var Lverde = {r: 0, g: 255, b: 0, a: 255, C: 'Verde', DistA: 200};
var Lazul = {r: 0, g: 0, b: 255, a: 255, C: 'Azul', DistA: 200};

//var DA = 180;

var CountRojo = 0;
var CountVerde = 0;

var TotalVision = 0;
var PorcRojo = 0;
var PorcVerde= 0;

function mostrarCamara() {
	video = document.getElementById("video");
	canvas = document.getElementById("canvas");

	var opciones = {
		audio: false,
		video: {
			width: anchoCamara, height: altoCamara
		}
	};

	if(navigator.mediaDevices.getUserMedia) {
		navigator.mediaDevices.getUserMedia(opciones)
		    .then(function(stream) {
		    	video.srcObject = stream;

				CountRojo = procesarCamara(Lrojo);

		    })
		    .catch(function(err) {
		    	console.log("Oops, hubo un error", err);
		    })
	} else {
		console.log("No existe la funcion getUserMedia... oops :( ");
	}
}


function procesarCamara(pick)  {

    var ctx = canvas.getContext("2d");

	ctx.drawImage(video, 0, 0, anchoCamara, altoCamara, 0, 0, canvas.width, canvas.height);

	var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
	var pixeles = imgData.data;

    var leds = [];

    var Counter = 0;

    var AreaT = 0;

    for (var p=0; p < pixeles.length; p += 4)  {

        var rojo = pixeles[p];
		var verde = pixeles[p+1];
		var azul = pixeles[p+2];
		var alpha = pixeles[p+3];
		
		var distancia = Math.sqrt(
			Math.pow(pick.r - rojo, 2) + 
			Math.pow(pick.g - verde, 2) + 
			Math.pow(pick.b - azul, 2)
		);

        if (distancia < pick.DistA)  {

            pixeles[p] = pick.r;
			pixeles[p+1] = pick.g;
			pixeles[p+2] = pick.b;

            var y = Math.floor(p / 4 / canvas.width);
			var x = (p/4) % canvas.width;

            if(leds.length == 0)  {
				//primer led
				var led = new Led(x, y);
				leds.push(led);
			}else  {

                leds[0].agregarpixel(x, y);
                
            }

            Counter++;

        }else  {

            //Pintar de negro el pixel

            /*pixeles[p] = 0;
			pixeles[p+1] = 0;
			pixeles[p+2] = 0;*/
            pixeles[p+3] = 80;
        }

    }

    ctx.putImageData(imgData, 0, 0);

    setTimeout(() => {
        CountRojo = procesarCamara(Lrojo)
        CountVerde = procesarCamara(Lverde)

        TotalVision = CountRojo + CountVerde;

        PorcRojo = (CountRojo / TotalVision) * 100;
        PorcVerde = (CountVerde / TotalVision) * 100;

        console.log('Conteo rojo: ', CountRojo);
        console.log('Conteo verde: ', CountVerde);

		var lbCountRojos = document.getElementById('lblCountRojos');
		var lbCountVerdes = document.getElementById('lblCountVerdes');

		lbCountRojos.innerHTML = PorcRojo;
		lbCountVerdes.innerHTML = PorcVerde;
    }, 20);

    //console.log('Total pixeles: ', Counter);

    AreaT = Math.round((Counter / (pixeles.length / 4))*100);

    console.log('Area cubierta: ', AreaT);

	return AreaT;
}