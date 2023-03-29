import { gsap } from 'gsap';
import $ from 'jquery';


const h1 = $("h1");

gsap.from(h1, {
    opacity: 0,
    duration: 1,
    x: 10,
})
console.log("gsap");