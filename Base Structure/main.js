document.addEventListener("DOMContentLoaded", function () {
  // Obtén la URL de la página actual
  var currentUrl = window.location.href;
  console.log(currentUrl);
  // Obtén todos los enlaces del menú
  var menuLinks = document.querySelectorAll("nav a");
  console.log(menuLinks);
  // Itera sobre los enlaces y verifica si la URL coincide con el atributo href
  menuLinks.forEach(function (link) {
    if (link.href === currentUrl) {
      link.classList.add("active");
    }
  });



  // Obtén las referencias a los elementos del DOM
  const carouselContainer = document.querySelector('.carousel-container');
  const slides = document.querySelectorAll('.carousel-slide');
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');

  let currentIndex = 0;

  // Función para mostrar la diapositiva actual
  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.style.display = i === index ? 'block' : 'none';
    });
  }

  // Función para pasar a la siguiente diapositiva
  function nextSlide() {
    currentIndex = (currentIndex + 1) % slides.length;
    showSlide(currentIndex);
  }

  // Función para retroceder a la diapositiva anterior
  function prevSlide() {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    showSlide(currentIndex);
  }

  // Agrega eventos de clic a los botones
  nextBtn.addEventListener('click', nextSlide);
  prevBtn.addEventListener('click', prevSlide);

  // Muestra la primera diapositiva al cargar la página
  showSlide(currentIndex);
  
});


var miDiv = document.getElementById('uno');

miDiv.addEventListener('click', function() {
  // Redirecciona a una nueva pestaña
  window.location.href = 'manifesting_the_beach.html';
 
});

function redirectToContact(){
  window.location.href = 'contact.html';
}
