import React from "react";
import EmblaCarousel from "./Carousel/js/EmblaCarousel";
import { EmblaOptionsType } from "embla-carousel";
import "./Carousel/css/embla.css";

const OPTIONS: EmblaOptionsType = { loop: true };
const SLIDE_COUNT = 5;
const SLIDES = Array.from(Array(SLIDE_COUNT).keys());

export default function HeroCarousel() {
  return <EmblaCarousel slides={SLIDES} options={OPTIONS} />;
}
