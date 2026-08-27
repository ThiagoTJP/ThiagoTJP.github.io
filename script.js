document.addEventListener('DOMContentLoaded', () => {


    // 1. LÓGICA DE LOS FILTROS DE PROYECTOS

    const botonesFiltro = document.querySelectorAll('.btn-filtro');
    const tarjetasProyectos = document.querySelectorAll('.tarjeta-proyecto');

    botonesFiltro.forEach(boton => {
        boton.addEventListener('click', (e) => {
            // CLAVE: Evita que la página salte o se recargue si son etiquetas <a>
            e.preventDefault();

            // 1. Le sacamos la clase "active" a TODOS los botones
            botonesFiltro.forEach(b => b.classList.remove('active'));

            // 2. Se la agregamos SOLO al botón que acabamos de hacer clic
            boton.classList.add('active');

            // 3. Lógica de filtrado
            const filtro = boton.getAttribute('data-filtro');

            tarjetasProyectos.forEach(tarjeta => {
                // Leemos las categorías (agregamos un fallback por si alguna tarjeta no tiene el atributo)
                const categorias = tarjeta.getAttribute('data-categoria') || "";

                if (filtro === 'todos' || categorias.includes(filtro)) {
                    tarjeta.style.display = 'flex';
                } else {
                    tarjeta.style.display = 'none';
                }
            });
        });
    }); 


    // 2. LÓGICA DE LAS BANDERAS DE IDIOMA

    const btnEs = document.getElementById('btn-es');
    const btnEn = document.getElementById('btn-en');
    let idiomaActual = 'es';

    function cambiarIdioma(nuevoIdioma) {
        if (idiomaActual === nuevoIdioma) return; // Si ya está en ese idioma, no hace nada

        idiomaActual = nuevoIdioma;

        // Cambiar clases visuales (prender/apagar colores de banderas)
        if (idiomaActual === 'es') {
            btnEs.classList.add('active');
            btnEn.classList.remove('active');
        } else {
            btnEn.classList.add('active');
            btnEs.classList.remove('active');
        }

        // Buscar y reemplazar los textos
        const elementosTraducibles = document.querySelectorAll('[data-en]');
        elementosTraducibles.forEach(elemento => {
            elemento.innerHTML = elemento.getAttribute(`data-${idiomaActual}`);
        });
    }

    // Le agregamos el evento de clic a cada bandera
    if (btnEs && btnEn) { // Verificación por las dudas de que no encuentre los botones
        btnEs.addEventListener('click', (e) => {
            e.preventDefault();
            cambiarIdioma('es');
        });

        btnEn.addEventListener('click', (e) => {
            e.preventDefault();
            cambiarIdioma('en');
        });
    }

    // 3. MODO TERMINAL LINUX (AVANZADO)
    const btnTerminal = document.getElementById('btn-terminal');
    const consolaLinux = document.getElementById('consola-linux');
    const seccionesWeb = document.querySelectorAll('main > section');
    const terminalInput = document.getElementById('terminal-input');
    const terminalBody = document.getElementById('terminal-body');
    const inputPrompt = document.querySelector('.terminal-input-line .prompt');
    const inputLine = document.querySelector('.terminal-input-line'); // Contenedor del input

    let modoConsolaActivo = false;
    let directorioActual = '~';
    let instalacionCompleta = false; 

    const enlacesProyectos = {
        'veflo': 'https://veflo.com.ar/',
        'building': 'https://building-b21eb.web.app/',
        'ggbienestar': 'https://github.com/ThiagoTJP/GGBienestar',
        'vitalclinic': 'https://github.com/ThiagoTJP/VitalClinic-API',
        'lamine_rise': 'https://thiagouces.itch.io/lamine-rises',
        'infraestructura': 'https://github.com/ThiagoTJP/Infraestructura_redes',
        'qa_igrowker': 'https://github.com/ThiagoTJP/Igrowker---QA-testing',
        'rick_morty': 'https://github.com/ThiagoTJP/RickAndMortyAPI'
    };

    // Función para simular el delay de carga
    const esperar = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    // Secuencia de booteo (Instalación fake)
    async function iniciarSecuenciaBoot() {
        inputLine.style.display = 'none'; // Ocultamos el input mientras instala

        imprimirEnConsola('<span class="prompt">guest@portfolio:~$</span> sudo apt-get install Thiago_Poletti');
        await esperar(800);
        imprimirEnConsola('Leyendo lista de paquetes... Hecho');
        await esperar(400);
        imprimirEnConsola('Creando árbol de dependencias... Hecho');
        await esperar(500);
        imprimirEnConsola('Se instalarán los siguientes paquetes adicionales:');
        imprimirEnConsola('  <span style="color:#f3b229">thiago-fullstack-dev thiago-qa-tester thiago-it-support</span>');
        await esperar(1000);
        imprimirEnConsola('Desempaquetando Thiago_Poletti (1.0.0) ...');
        await esperar(700);
        imprimirEnConsola('Configurando dependencias... OK');
        await esperar(400);
        imprimirEnConsola('<span style="color:#27c93f">[ OK ] Instalación completada con éxito.</span>');
        await esperar(600);
        imprimirEnConsola('<br>Bienvenido al sistema. Escribí <span class="comando-resalto">\'help\'</span> para ver los comandos disponibles.');

        inputLine.style.display = 'flex'; // Volvemos a mostrar el input
        terminalInput.focus();
        instalacionCompleta = true;
    }

    // Abrir/Cerrar la consola
    if (btnTerminal) {
        btnTerminal.addEventListener('click', (e) => {
            e.preventDefault();
            modoConsolaActivo = !modoConsolaActivo;

            if (modoConsolaActivo) {
                seccionesWeb.forEach(sec => sec.style.display = 'none');
                consolaLinux.style.display = 'block';
                btnTerminal.style.color = '#27c93f';

                // Si es la primera vez que la abre, corre la instalación
                if (!instalacionCompleta) {
                    iniciarSecuenciaBoot();
                } else {
                    terminalInput.focus();
                }
            } else {
                seccionesWeb.forEach(sec => sec.style.display = 'block');
                consolaLinux.style.display = 'none';
                btnTerminal.style.color = '';
            }
        });
    }

    // Escuchar cuando el usuario aprieta "Enter"
    if (terminalInput) {
        terminalInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                const comandoBruto = this.value;
                const comando = comandoBruto.toLowerCase().trim();

                imprimirEnConsola(`<span class="prompt">thiago@portfolio:${directorioActual}$</span> ${comandoBruto}`);
                this.value = '';
                procesarComando(comando);
            }
        });
    }

    // Asegura que al hacer clic en cualquier parte de la consola, puedas escribir
    if (consolaLinux) {
        consolaLinux.addEventListener('click', () => {
            if (instalacionCompleta) terminalInput.focus();
        });
    }

    function imprimirEnConsola(html) {
        const nuevoParrafo = document.createElement('p');
        nuevoParrafo.className = 'terminal-text';
        nuevoParrafo.innerHTML = html;

        const lineaInput = document.querySelector('.terminal-input-line');
        terminalBody.insertBefore(nuevoParrafo, lineaInput);

        terminalBody.scrollTop = terminalBody.scrollHeight; // Auto-scroll
    }

    function actualizarPrompt() {
        // Actualiza el texto al lado del cursor si cambiamos de carpeta
        if (inputPrompt) {
            inputPrompt.innerHTML = `thiago@portfolio:${directorioActual}$`;
        }
    }

    function procesarComando(cmdText) {
        if (cmdText === '') return;

        // Separamos el comando de su argumento (ej: "cd proyectos" -> base="cd", arg="proyectos")
        const partes = cmdText.split(' ');
        const cmdBase = partes[0];
        const argumento = partes.slice(1).join(' ');

        switch (cmdBase) {
            case 'help':
                imprimirEnConsola('Comandos disponibles:');
                imprimirEnConsola('- <span class="comando-resalto">ls</span>: Lista los archivos y directorios.');
                imprimirEnConsola('- <span class="comando-resalto">cd [directorio]</span>: Cambia de carpeta (ej: cd proyectos).');
                imprimirEnConsola('- <span class="comando-resalto">cd ..</span>: Vuelve a la carpeta anterior.');
                imprimirEnConsola('- <span class="comando-resalto">cat [archivo]</span>: Lee un archivo de texto.');
                imprimirEnConsola('- <span class="comando-resalto">open [nombre]</span>: Abre un proyecto o archivo (ej: open veflo o open cv.pdf).');
                imprimirEnConsola('- <span class="comando-resalto">neofetch</span>: Muestra info del sistema.');
                imprimirEnConsola('- <span class="comando-resalto">clear</span>: Limpia la consola.');
                imprimirEnConsola('- <span class="comando-resalto">exit</span>: Volver a Windows.');
                break;

            case 'ls':
            case 'dir':
                if (directorioActual === '~') {
                    imprimirEnConsola('sobre_mi.txt&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#3b82f6; font-weight:bold;">proyectos/</span>&nbsp;&nbsp;&nbsp;&nbsp;cv.pdf');
                } else if (directorioActual === '~/proyectos') {
                    // Muestra los proyectos en color verde (como archivos ejecutables)
                    imprimirEnConsola('<span style="color:#27c93f">veflo</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#27c93f">building</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#27c93f">ggbienestar</span>');
                    imprimirEnConsola('<span style="color:#27c93f">vitalclinic</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#27c93f">lamine_rise</span>&nbsp;&nbsp;&nbsp;<span style="color:#27c93f">infraestructura</span>');
                    imprimirEnConsola('<span style="color:#27c93f">qa_igrowker</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#27c93f">rick_morty</span>');
                }
                break;

            case 'cd':
                if (argumento === 'proyectos') {
                    directorioActual = '~/proyectos';
                    actualizarPrompt();
                } else if (argumento === '..' || argumento === '../') {
                    directorioActual = '~';
                    actualizarPrompt();
                } else if (argumento === '') {
                    directorioActual = '~';
                    actualizarPrompt();
                } else {
                    imprimirEnConsola(`cd: ${argumento}: No existe el archivo o el directorio`);
                }
                break;

            case 'cat':
                if (argumento === 'sobre_mi.txt' && directorioActual === '~') {
                    imprimirEnConsola('Técnico Universitario en Programación graduado. Experiencia en Full Stack (React, Java, Spring Boot) y QA Testing. Buscando mi primera oportunidad laboral como Dev.');
                } else if (argumento === '') {
                    imprimirEnConsola(`cat: falta un argumento (ej: cat sobre_mi.txt)`);
                } else {
                    imprimirEnConsola(`cat: ${argumento}: No existe el archivo o es un directorio`);
                }
                break;

            case 'open':
            case './': // También permitimos ejecutarlo estilo Linux (ej: ./veflo)
            case 'start':
                let target = argumento;
                if (cmdBase === './') target = cmdText.replace('./', ''); // Limpia si usó ./

                if (directorioActual === '~/proyectos') {
                    if (enlacesProyectos[target]) {
                        imprimirEnConsola(`Lanzando proceso: ${target} [OK]`);
                        window.open(enlacesProyectos[target], '_blank'); // Abre en pestaña nueva
                    } else {
                        imprimirEnConsola(`open: ${target}: proyecto no encontrado. Ejecutá 'ls' para ver la lista.`);
                    }
                } else if (target === 'cv.pdf' && directorioActual === '~') {
                    imprimirEnConsola(`Abriendo documento PDF...`);
                    // Asegurate de que esta ruta apunte exactamente a donde tenés guardado tu CV en la carpeta del proyecto
                    window.open('assets/ThiagoPoletti_CV_Desarrollador.pdf', '_blank');
                } else {
                    imprimirEnConsola(`open: ${target}: no se encontró el archivo. Fijate si estás en la carpeta correcta usando 'cd'.`);
                }
                break;

            case 'neofetch':
                imprimirEnConsola(`
<pre style="color:#27c93f; font-family:monospace; margin:0;">
    .----.    OS: Huayra Linux / Windows 11 (Dual Boot)
   /  ..  \\   Host: Thiago Poletti Portfolio
  |  /  \\  |  Kernel: Full Stack Dev & QA
  |  \\  /  |  Uptime: 24/7
   \\  ''  /   Shell: Zsh
    '----'    Resolución: 100% de problemas
</pre>
                `);
                break;

            case 'clear':
                const textos = document.querySelectorAll('.terminal-body .terminal-text');
                textos.forEach(txt => txt.remove());
                break;

            case 'exit':
                btnTerminal.click();
                break;

            default:
                imprimirEnConsola(`bash: ${cmdBase}: no se encontró la orden. Escribí 'help' para ver los comandos.`);
        }
    }


    // SALIDA DE EMERGENCIA: Clic en el menú

    const enlacesMenu = document.querySelectorAll('.nav-links a');

    enlacesMenu.forEach(enlace => {
        enlace.addEventListener('click', () => {
            // Si hacen clic en una sección del menú Y la consola está abierta...
            if (modoConsolaActivo) {
                btnTerminal.click(); // Simulamos un clic en el botón de la terminal para cerrarla
            }
        });
    });

});

