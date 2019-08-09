/***************************************************************************/
/* Paso 1: Se definen los codigos shaders.                                 */
/***************************************************************************/
var codigoShaderFragmento = [
    'precision mediump float;',
    '',
    'void main()',
    '{',
    '   gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);',
    '}'
].join('\n');

codigoShaderVertice = [
    'precision mediump float;',
    '',
    'attribute vec2 aVertices;',
    '',
    'void main()',
    '{',
    'gl_Position = vec4(aVertices, 0.0, 1.0);',
    '}'
].join('\n');

/***************************************************************************/
/* Paso 2: Se prepara el lienzo y se obtiene el contexto del WebGL.        */
/***************************************************************************/

var iniciarDemo = function() {
    console.log("Esto esta tabajando");

    var canvas = document.getElementById('superficie-juego');
    var gl = canvas.getContext('webgl');

    /* hacemos sentencias para navegadores que no soportan WebGL */
    if (!gl) {
        console.log('No soporta WebGL, retrocediendo en experimental-webgl');
        gl = canvas.getContext('experimental-webgl');
    }
    if (!gl) {
        alert('Tu navegador no soporta WebGL');
    }

    /* COLOR DE FONDO - gl.clearColor(R,G,B,A);¨*/
    gl.clearColor(0.74, 0.85, 0.8, 1.0);

    /* INICIALIZA EL BUFFER DE COLOR o PROFUNDIDAD */
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // ajustamos el canvas
    /*
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gl.viewport(0, 0, window.innerWidth, window.innerHeight); //Se define la ventana de despliegue
    */

     /***************************************************************************/
    /* Paso 3: Se crean, compilan y enlazan los programas Shader               */
    /***************************************************************************/
    
    /* Se compila el shader de vertice */
    var shaderDeVertice = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(shaderDeVertice, codigoShaderVertice);
    gl.compileShader(shaderDeVertice);
    if (!gl.getShaderParameter(shaderDeVertice, gl.COMPILE_STATUS)) {
        console.error('ERROR en compilar Shader de Vertice!', gl.getShaderInfoLog(shaderDeVertice));
        return;
    }

    /* Se compila el shader de fragmento */
    var shaderDeFragmento = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(shaderDeFragmento, codigoShaderFragmento);
    gl.compileShader(shaderDeFragmento);
    if (!gl.getShaderParameter(shaderDeFragmento, gl.COMPILE_STATUS)) {
        console.error('ERROR en compilar Shader de Fragmento!', gl.getShaderInfoLog(shaderDeFragmento));
        return;
    }
    
    /* Se enlaza ambos shader */
    var programaID = gl.createProgram();
    gl.attachShader(programaID, shaderDeVertice); 
    gl.attachShader(programaID, shaderDeFragmento);
    gl.linkProgram(programaID);
    if (!gl.getProgramParameter(programaID, gl.LINK_STATUS)) {
        console.error('ERROR enlazando el programa!', gl.getProgramInfoLog(programaID));
        return;
    }
    
    /* Validamos el programa*/
    gl.validateProgram(programaID);
    if (!gl.getProgramParameter(programaID, gl.LINK_STATUS)) {
        console.error('ERROR validando el programa!', gl.getProgramInfoLog(programaID));
        return;
    }

    /***************************************************************************/
    /* Paso 4: Se define la geometria y se almacenan en los buffers de memoria.*/
    /***************************************************************************/

    /* Area de despliegue: (-1, -1) - (1, 1) */
    /* Las coordenadas cartesianas (x, y) */
    
    var vertices = 
    [   // X, Y         SEGUNDA ESTRELLA
        0, -0.2,      // 0
        0.1, -0.5,   // 1
        0.4,-0.5,     // 2
	    0.2,-0.7,     // 3
	    0.3,-1,     // 4
	    0,-0.8,       // 5
	    -0.3,-1,       // 6
	    -0.2,-0.7,	// 7
	    -0.4,-0.5,    // 7
	    -0.1,-0.5,  // 9
	    0,-0.2        // 10
    ];
    
    var vertices2 = 
    [   // X, Y         SEGUNDA ESTRELLA
        0.1,-0.5,   // 0
	    0,-0.6,       // 1
	    0.4,-0.5,	    // 2
	    0.2,-0.7,     // 3
	    0,-0.6,       // 4
	    0.3,-1,	    // 5
	    0,-0.8,       // 6
	    0,-0.6,       // 7
	    -0.3,-1,	// 8
	    -0.2,-0.7,    // 9
	    0,-0.6,       // 10
	    -0.4,-0.5,    // 11
	    -0.1,-0.5,  // 12
	    0,-0.6,       // 13
	    0,-0.2        // 14
    ];
    var vertices3 = 
    [   // X, Y         PRIMERA ESTRELLA
        0,1,        // 0
		0.1,0.7,    // 1
		0.4,0.7,      // 2
		0.2,0.5,      // 3
		0.3,0.2,      // 4
		0,0.4,        // 5
		-0.3,0.2,     // 6
		-0.2,0.5,     // 7
		-0.4,0.7,     // 8
		-0.1,0.7,   // 9
		0,1         // 10
    ];

    /* Se genera un nombre (codigo) para el buffer */ 
    var verticeBuffer = gl.createBuffer();
    /* Se asigna un nombre (codigo) al buffer */
    gl.bindBuffer(gl.ARRAY_BUFFER, verticeBuffer);
    /* Obtiene los ID de las variables atributos */
    var aVertices = gl.getAttribLocation(programaID, "aVertices");  
    /* Se especifica el arreglo de vertices */
    gl.vertexAttribPointer(
        aVertices,    // ubicación del atributo
        2,            // numero de elementos por atributo
        gl.FLOAT,     // tipo de elementos 
        gl.FALSE,                   
        2 * Float32Array.BYTES_PER_ELEMENT, // tamaño de un vértice individual
        0             // desplazamiento desde el principio de un vértice simple a este atributo
    );
    /* Se habilita el ID para el arreglo de vertices */
    gl.enableVertexAttribArray(aVertices);
    
    /***************************************************************************/
    /* Paso 5: Se define el bucle de render principal.*/
    /***************************************************************************/
    
    /* Se instala el programa de shaders para utilizarlo */
    gl.useProgram(programaID);
    
    /************************** BUFFER 1 *******************/
    /* Se transfiere los datos desde la memoria nativa al buffer de la GPU */
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);                                                                                                                                                                                                                                                                                                                                                                             
    /* Se renderiza las primitivas desde los datos del arreglo */
    gl.drawArrays(gl.LINE_LOOP, 0, 11);  // aqui es cuando queremos cambiar el numero de vertices
    
    /*************************************** BUFFER 2 ****************************/
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices2), gl.STATIC_DRAW);                                                                                                                                                                                                                                                                                                                                                                                                          
    gl.drawArrays(gl.LINE_LOOP, 0, 15);
    
    /*********************************** BUFFER 3 **********************************/
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices3), gl.STATIC_DRAW);                                                                                                                                                                                                                                                                                                                                                                                                          
    gl.drawArrays(gl.LINE_LOOP, 0, 11);  
    
};
