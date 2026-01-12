import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import { Image } from "@chakra-ui/react";
import AOS from "aos";
import "aos/dist/aos.css";
import "./aboutcss.css";

const About = () => {
  useEffect(() => {
    AOS.init({
      duration: 1200,
      once: true,
      offset: 100,
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
          backgroundImage:
            "url('https://images.unsplash.com/photo-1601933470928-c45f3f7c5a4b?auto=format&fit=crop&w=1600&q=80')",
        }}
      >
        <div className="overlay" data-aos="zoom-in">
          <h1 data-aos="fade-up">VIYAVAR</h1>
          <p data-aos="fade-up" data-aos-delay="300">
            A tribute to the Head Soldier — leadership, courage, and honor in
            every thread.
          </p>
        </div>
      </div>

      {/* ================= WHO WE ARE ================= */}
      <div className="Content1">
        <div className="text" data-aos="fade-right">
          <h1>Who We Are</h1>
          <p>
            Viyavar means <strong>Head Soldier</strong> — the one who leads from
            the front, stands fearless, and protects without hesitation.
            <br />
            <br />
            We are a clothing brand created to honor that spirit. Every printed
            shirt is a mark of respect for leadership, discipline, and sacrifice.
          </p>
        </div>

        <div className="imagecontainer" data-aos="fade-left">
          <Image
            boxSize="400px"
            objectFit="cover"
            src="https://images.unsplash.com/photo-1593032465171-8b58b5bda4f3?auto=format&fit=crop&w=600&q=80"
            alt="Viyavar Identity"
          />
        </div>
      </div>

      {/* ================= VISION ================= */}
      <div className="Content2">
        <div className="imagecontainer" data-aos="fade-right">
          <Image
            boxSize="400px"
            objectFit="cover"
            src="https://images.unsplash.com/photo-1601582589907-f92af5ed9db8?auto=format&fit=crop&w=600&q=80"
            alt="Vision"
          />
        </div>

        <div className="text" data-aos="fade-left">
          <h1>Our Vision</h1>
          <p>
            To become a symbol of honor and strength, where every Viyavar shirt
            represents the spirit of a head soldier — leading with courage,
            standing firm, and inspiring generations through wearable pride.
          </p>
        </div>
      </div>

      {/* ================= MISSION ================= */}
      <div className="Content1">
        <div className="text" data-aos="fade-right">
          <h1>Our Mission</h1>
          <p>
            Viyavar exists to pay tribute to the head soldier — the leader, the
            protector, the one who stands first in every battle.
            <br />
            <br />
            Through thoughtfully designed printed apparel, we transform stories
            of courage, unity, and sacrifice into clothing that speaks louder
            than words.
            <br />
            <br />
            Our mission is to let people wear respect, leadership, and pride —
            every single day.
          </p>
        </div>

        <div className="imagecontainer" data-aos="fade-left">
          <Image
            boxSize="400px"
            objectFit="cover"
            src="https://images.unsplash.com/photo-1601582589748-6a1d1e99f9d6?auto=format&fit=crop&w=600&q=80"
            alt="Mission"
          />
        </div>
      </div>

      {/* ================= CRAFT ================= */}
      <div className="Content2">
        <div className="imagecontainer" data-aos="fade-right">
          <Image
            boxSize="400px"
            objectFit="cover"
            src="https://images.unsplash.com/photo-1585386959984-a41552231692?auto=format&fit=crop&w=600&q=80"
            alt="Craftsmanship"
          />
        </div>

        <div className="text" data-aos="fade-left">
          <h1>Our Craft</h1>
          <p>
            Every Viyavar shirt is built with purpose. From premium fabric
            selection to bold, meaningful prints, our craftsmanship reflects
            discipline, durability, and pride — just like a soldier’s mindset.
            <br />
            <br />
            We don’t follow trends. We create statements that last.
          </p>
        </div>
      </div>

      {/* ================= VALUES ================= */}
      <div className="values-section">
        <h1 data-aos="fade-up">What We Stand For</h1>

        <div className="values-grid">
          <div className="value-card" data-aos="fade-up">
            <h3>Leadership</h3>
            <p>Designs inspired by those who lead by example.</p>
          </div>

          <div className="value-card" data-aos="fade-up" data-aos-delay="150">
            <h3>Courage</h3>
            <p>Fearless expression that honors strength and sacrifice.</p>
          </div>

          <div className="value-card" data-aos="fade-up" data-aos-delay="300">
            <h3>Discipline</h3>
            <p>Precision in fabric, print, and finish — no compromises.</p>
          </div>
        </div>
      </div>

      {/* ================= FINAL PARALLAX ================= */}
      <div
        className="parallax-banner2"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1590086782792-42dd2350140d?auto=format&fit=crop&w=1600&q=80')",
        }}
      >
        <div className="overlay" data-aos="zoom-in">
          <h2 data-aos="fade-up">Wear the Leader Within</h2>
          <p data-aos="fade-up" data-aos-delay="200">
            Not just fashion. A tribute to courage.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
