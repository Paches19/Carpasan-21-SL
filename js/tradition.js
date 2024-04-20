/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   tradition.js                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: adpachec <adpachec@student.42madrid.com>   +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/07/13 12:38:41 by adpachec          #+#    #+#             */
/*   Updated: 2024/04/20 11:07:55 by adpachec         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

let sliderIndex = 0;
const sliderItems = document.getElementsByClassName('slider-item');
let intervalId;

function moverSlider(n) {
  sliderIndex += n;
  if (sliderIndex < 0) {
    sliderIndex = sliderItems.length - 1;
  } else if (sliderIndex >= sliderItems.length) {
    sliderIndex = 0;
  }
  mostrarSlider();
}

function mostrarSlider() {
  for (let i = 0; i < sliderItems.length; i++) {
    sliderItems[i].classList.remove('active');
  }
  sliderItems[sliderIndex].classList.add('active');
}

function iniciarRotacionAutomatica() {
  intervalId = setInterval(() => {
    moverSlider(1);
  }, 4000);
}

function detenerRotacionAutomatica() {
  clearInterval(intervalId);
}

iniciarRotacionAutomatica();

const sliderContainer = document.querySelector('.slider-container');
sliderContainer.addEventListener('mouseover', detenerRotacionAutomatica);
sliderContainer.addEventListener('mouseout', iniciarRotacionAutomatica);

