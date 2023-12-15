document.addEventListener("DOMContentLoaded", function () {
  // Obt�n la URL de la p�gina actual
  var currentUrl = window.location.href;
  console.log(currentUrl);
  // Obt�n todos los enlaces del men�
  var menuLinks = document.querySelectorAll("nav a");
  console.log(menuLinks);
  // Itera sobre los enlaces y verifica si la URL coincide con el atributo href
  menuLinks.forEach(function (link) {
    if (link.href === currentUrl) {
      link.classList.add("active");
    }
  });



  // Obt�n las referencias a los elementos del DOM
  const carouselContainer = document.querySelector('.carousel-container');
  const slides = document.querySelectorAll('.carousel-slide');
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');

  let currentIndex = 0;

  // Funci�n para mostrar la diapositiva actual
  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.style.display = i === index ? 'block' : 'none';
    });
  }

  // Funci�n para pasar a la siguiente diapositiva
  function nextSlide() {
    currentIndex = (currentIndex + 1) % slides.length;
    showSlide(currentIndex);
  }

  // Funci�n para retroceder a la diapositiva anterior
  function prevSlide() {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    showSlide(currentIndex);
  }

  // Agrega eventos de clic a los botones
  nextBtn.addEventListener('click', nextSlide);
  prevBtn.addEventListener('click', prevSlide);

  // Muestra la primera diapositiva al cargar la p�gina
  showSlide(currentIndex);
  
});


var miDiv = document.getElementById('uno');

miDiv.addEventListener('click', function() {
  // Redirecciona a una nueva pesta�a
  window.location.href = 'manifesting_the_beach.html';
 
});

function redirectToContact(){
  window.location.href = 'contact.html';
}
