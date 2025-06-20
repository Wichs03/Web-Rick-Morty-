function crearHero(){
    let contenedor=document.getElementById("hero-container");
    const personajes = [1, 2, 3, 4, 265, 183];
    let index = 0;
    const intervalo = setInterval(() => {
    index = (index + 1) % personajes.length;
    cargarPersonajes(personajes[index]);
    }, 5000);
    contenedor.innerHTML= `
    <section class="relative bg-gray-800 rounded-lg overflow-hidden shadow-md mx-4">
      <img id="hero-img" src="" alt="Personaje" class="w-full h-84 object-center sm:h-100" />
      
      <h2 id="hero-name" class="absolute bottom-3 left-3 text-white text-xl font-semibold bg-black/50 px-2 py-1 rounded-md">
        Nombre
      </h2>
      
      <button id="btn-prev" class="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 text-white px-2 py-1 text-lg rounded-full">
        ←
      </button>
      
      <button id="btn-next" class="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 text-white px-2 py-1 text-lg rounded-full">
        →
      </button>
    </section>
  `;
  async function cargarPersonajes(id) {
    try {
        let respuesta= await fetch(`https://rickandmortyapi.com/api/character/${id}`);
        let datos= await respuesta.json()
        console.log(datos)
        document.getElementById("hero-img").src = datos.image;
        document.getElementById("hero-name").textContent = datos.name;
    } catch (error) {
        console.error("Error al cargar personaje:", error);
    }
  }
  document.getElementById("btn-prev").onclick = () => {
    index = (index - 1 + personajes.length) % personajes.length;
    cargarPersonajes(personajes[index]);
  };

  document.getElementById("btn-next").onclick = () => {
    index = (index + 1) % personajes.length;
    cargarPersonajes(personajes[index]);
  };

  
  cargarPersonajes(personajes[index]);
}

