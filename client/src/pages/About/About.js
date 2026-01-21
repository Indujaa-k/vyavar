import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import { Image } from "@chakra-ui/react";
import AOS from "aos";
import "aos/dist/aos.css";
import "./aboutcss.css";

import img1 from "../../assets/about/DSC01964.JPG";
import img2 from "../../assets/about/DSC01966.JPG";
import img3 from "../../assets/about/DSC02055.JPG";
import img4 from "../../assets/about/DSC02095.JPG";
import img5 from "../../assets/about/DSC02575.JPG";
import img6 from "../../assets/about/DSC02570.JPG";
import img7 from "../../assets/about/DSC02581.JPG";

const About = () => {
  useEffect(() => {
    AOS.init({
      duration: 1200,
      once: true,
      offset: 120,
      easing: "ease-in-out",
    });
  }, []);

  return (
    <div className="aboutcontainer">
      <Helmet>
        <title>About | Viyavar</title>
      </Helmet>

      {/* ================= HERO ================= */}
      <div
        className="parallax-banner"
        style={{
          backgroundImage: `url(${img7})`,
        }}
      >
        <div className="overlay">
          <h1 data-aos="fade-up">VIYAVAR</h1>
          <p data-aos="fade-up" data-aos-delay="200">
            A tribute to the Head Soldier — leadership, courage, and honor
            stitched into every thread.
          </p>
        </div>
      </div>

      {/* ================= WHO WE ARE ================= */}
      <section className="Content1">
        <div className="text" data-aos="fade-right">
          <h1>Who We Are</h1>
          <p>
            <strong>Viyavar</strong> means <strong>Head Soldier</strong> — the
            one who leads from the front, stands fearless, and protects without
            hesitation.
            <br />
            <br />
            We are not just a clothing brand. We are a symbol of leadership,
            discipline, and sacrifice — transformed into wearable identity.
            <br />
            <br />
            Each piece carries the spirit of those who protect, inspire, and
            stand firm even when the weight of duty is heavy.
            <br />
            Designed for those who carry strength quietly and command respect
            without speaking.
          </p>
        </div>

        <div className="imagecontainer" data-aos="zoom-in">
          <Image src={img1} boxSize="420px" objectFit="cover" />
        </div>
      </section>

      {/* ================= VISION ================= */}
      <section className="Content2">
        <div className="text" data-aos="fade-left">
          <h1>Our Vision</h1>
          <p>
            To become a symbol of strength and honor where every Viyavar shirt
            represents courage, leadership, and pride.
            <br />
            <br />A brand that speaks without words and stands beyond trends.
            <br />
            <br />
            Viyavar stands for pride in identity, strength in character, and
            confidence in every moment.
            <br />
            Our vision is to build a brand that speaks without words—one that
            transcends trends, seasons, and fast fashion.
          </p>
        </div>

        <div className="imagecontainer" data-aos="zoom-in" data-aos-delay="200">
          <Image src={img2} boxSize="420px" objectFit="cover" />
        </div>
      </section>

      {/* ================= MISSION ================= */}
      <section className="Content1">
        <div className="text" data-aos="fade-right">
          <h1>Our Mission</h1>
          <p>
            Viyavar exists to honor the head soldier — the leader, the
            protector, the one who stands first in every battle.
            <br />
            <br />
            Through bold designs and premium craftsmanship, we transform stories
            of courage and unity into apparel that carries meaning.
            <br /><br/>
            Each Viyavar shirt is crafted to remind you of who you are —
            resilient, fearless, and honorable.
            <br /><br/>
            Viyavar represents those who carry the weight of leadership with
            pride and wear their values with confidence.
          </p>
        </div>

        <div className="imagecontainer" data-aos="zoom-in">
          <Image src={img3} boxSize="420px" objectFit="cover" />
        </div>
      </section>

      {/* ================= STORY PARALLAX ================= */}
      <div
        className="parallax-banner story"
        style={{
          backgroundImage: `url(${img6})`,
        }}
      >
        <div className="overlay">
          <h2 data-aos="fade-up">Born From Respect</h2>
          <p data-aos="fade-up" data-aos-delay="200">
            Viyavar was not created to follow fashion.
            <br />
            It was created to represent leadership, loyalty, and honor — values
            that never fade.
          </p>
        </div>
      </div>

      {/* ================= CRAFT ================= */}
      <section className="Content2">
        <div className="text" data-aos="fade-left">
          <h1>Our Craft</h1>
          <p>
            Every Viyavar shirt is built with discipline. From premium fabric to
            bold prints, every detail reflects strength, durability, and pride.
            <br />
            <br />
            We don’t follow trends. We create statements.
          </p>
        </div>

        <div className="imagecontainer" data-aos="zoom-in">
          <Image src={img4} boxSize="420px" objectFit="cover" />
        </div>
      </section>

      {/* ================= VALUES ================= */}
      <section className="values-section">
        <h1 data-aos="fade-up">What We Stand For</h1>

        <div className="values-grid">
          <div className="value-card" data-aos="flip-up">
            <h3>Leadership</h3>
            <p>Inspired by those who lead by example.</p>
          </div>

          <div className="value-card" data-aos="flip-up" data-aos-delay="200">
            <h3>Courage</h3>
            <p>Fearless expression that honors sacrifice.</p>
          </div>

          <div className="value-card" data-aos="flip-up" data-aos-delay="400">
            <h3>Discipline</h3>
            <p>Precision in fabric, print, and purpose.</p>
          </div>
        </div>
      </section>

      {/* ================= FINAL PARALLAX ================= */}
      <div
        className="parallax-banner2"
        style={{
          backgroundImage: `url(${img5})`,
        }}
      >
        <div className="overlay">
          <h2 data-aos="fade-up">Wear the Leader Within</h2>
          <p data-aos="fade-up" data-aos-delay="200">
            Not just fashion.
            <br />A tribute to courage.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
