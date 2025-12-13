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
        <title>About | Never Fade Fashion</title>
      </Helmet>

      {/* ============ HERO PARALLAX ============ */}
      <div
        className="parallax-banner"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1600&q=80')",
        }}
      >
        <div className="overlay" data-aos="zoom-in">
          <h1 data-aos="fade-up" data-aos-delay="200">
            Never Fade Fashion
          </h1>
          <p data-aos="fade-up" data-aos-delay="400">
            Where elegance meets attitude — redefining fashion for the fearless.
          </p>
        </div>
      </div>

      {/* ============ OUR VISION ============ */}
      <div className="Content1">
        <div className="text" data-aos="fade-right">
          <h1>Our Vision</h1>
          <p>
            Never Fade Fashion is not just a clothing brand — it’s a statement
            of confidence and creativity. Born from the desire to make
            individuality timeless, our mission is to create designs that never
            fade from memory.
            <br />
            <br />
            Every collection carries the heartbeat of bold expression,
            celebrating people who dare to stand out. We combine premium
            materials with a vision that’s fearless, stylish, and authentic —
            because you deserve to wear confidence, not just clothes.
          </p>
        </div>

        <div className="imagecontainer" data-aos="fade-left">
          <Image
            className="mImage"
            boxSize="400px"
            objectFit="cover"
            src="https://images.unsplash.com/photo-1614771637369-ed94441a651a?auto=format&fit=crop&w=600&q=80"
            alt="Fashion Vision"
          />
        </div>
      </div>

      {/* ============ OUR CRAFT ============ */}
      <div className="Content2">
        <div className="imagecontainer" data-aos="fade-right">
          <Image
            className="mImage"
            boxSize="400px"
            objectFit="cover"
            src="https://images.unsplash.com/photo-1614038276039-667c23bc32fa?auto=format&fit=crop&w=600&q=80"
            alt="Fashion Craft"
          />
        </div>
        <div className="text" data-aos="fade-left">
          <h1>Our Craft</h1>
          <p>
            Our process blends creativity and precision. From handpicked fabrics
            to expert tailoring, every piece is built to endure. We design
            garments that breathe, move, and last — made by artists who believe
            in crafting stories, not just outfits.
            <br />
            <br />
            Each design goes through layers of refinement, ensuring that when
            you wear Never Fade, you wear excellence. Sustainability meets
            modern design — because real style never fades.
          </p>
        </div>
      </div>

      {/* ============ PARALLAX QUOTE ============ */}
      <div
        className="parallax-banner2"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1521334884684-d80222895322?auto=format&fit=crop&w=1600&q=80')",
        }}
      >
        <div className="overlay" data-aos="zoom-in">
          <h2 data-aos="fade-up">Timeless. Confident. You.</h2>
          <p data-aos="fade-up" data-aos-delay="200">
            Confidence is the real trend — and it never fades.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
