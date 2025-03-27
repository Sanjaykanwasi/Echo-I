import React, { useState, useEffect } from "react";
import { generateImages } from "../services/imageService";

const HeroSection = () => {
  // Toggle mode
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-theme");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark-theme");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // Random Description
  const [prompt, setPrompt] = useState("");
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const examplePrompts = [
    "A mystical desert oasis with floating lanterns and palm trees",
    "An ancient ruin deep in the jungle, covered in glowing runes",
    "A futuristic space station orbiting a distant planet",
    "A tiny cozy cabin in a snowy forest with smoke rising from the chimney",
    "A neon-lit alley in a futuristic cyberpunk city",
    "A mystical portal opening in the middle of a medieval town",
    "A Viking village by the sea with ships and bonfires",
    "A floating castle in the sky surrounded by storm clouds",
    "A ghostly pirate ship sailing under the full moon",
    "A hidden underwater cave filled with treasure and glowing crystals",
    "An enchanted autumn forest with trees made of golden light",
    "A futuristic library where books float in mid-air",
    "A secret garden with bioluminescent plants and fireflies",
    "A retro-futuristic diner on the moon with astronauts as customers",
    "A colossal clock tower with giant gears turning in the sky",
  ];

  const generateRandomPrompt = () => {
    const randomPrompt =
      examplePrompts[Math.floor(Math.random() * examplePrompts.length)];
    setPrompt(randomPrompt);
  };

  // Generate btn
  const handleFormSubmit = async () => {
    const count = parseInt(document.getElementById("count-select")?.value);

    if (!prompt.trim()) {
      alert("Please enter a description");
      return;
    }

    // Show loading state
    setIsLoading(true);

    // Create placeholder cards with loading spinners
    setImages(
      Array.from({ length: count }, (_, index) => ({
        id: index,
        status: "loading",
      }))
    );

    try {
      const data = await generateImages(prompt, count);

      // Update images with the generated images
      setImages(
        Array.from({ length: count }, (_, index) => ({
          id: index,
          src: data[index],
        }))
      );
    } catch (error) {
      alert("Failed to generate images. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadImage = (src, index) => {
    const link = document.createElement("a");
    link.href = src;
    link.download = `generated-image-${index + 1}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="hero-section">
      {/* Header DIV */}
      <div className="container">
        <header className="header">
          <div className="logo-wrapper">
            <div className="logo">
              <i className="fa-solid fa-wand-magic-sparkles"></i>
            </div>
            <h1>Echo I: AI Image Generator</h1>
          </div>
          <button
            className="theme-toggle"
            onClick={() => setDarkMode((prev) => !prev)}
          >
            <i className={`fa-solid ${darkMode ? "fa-sun" : "fa-moon"}`}></i>
          </button>
        </header>

        {/* Main Content Div */}
        <div className="main-content">
          <form action="#" className="prompt-form">
            <div className="prompt-container">
              <textarea
                placeholder={
                  prompt || "Describe your imagination in details..."
                }
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                required
                autoFocus
                className="propmt-input"
              ></textarea>
              <button
                onClick={generateRandomPrompt}
                type="button"
                className="prompt-btn"
              >
                <i className="fa-solid fa-dice"></i>
              </button>
            </div>

            <div className="prompt-actions">
              <div className="select-wrapper">
                <select
                  id="count-select"
                  defaultValue="4"
                  className="custom-select"
                  required
                >
                  <option value="" disabled>
                    Number of Images
                  </option>
                  <option value="1">1 Image</option>
                  <option value="2">2 Images</option>
                  <option value="3">3 Images</option>
                  <option value="4">4 Images</option>
                </select>
              </div>

              <button
                onClick={handleFormSubmit}
                className="generate-btn"
                type="submit"
              >
                <i className="fa-solid fa-wand-sparkles"></i>
                Generate
              </button>
            </div>

            {/* Gallery  */}
            <div className="gallery-grid">
              {images.map((img) => (
                <div
                  className={`img-card ${isLoading ? "loading" : ""}`}
                  key={img.id}
                >
                  {isLoading ? (
                    <div className="status-container">
                      <div className="spinner"></div>
                      <p className="status-text">Generating...</p>
                    </div>
                  ) : (
                    <>
                      <img
                        className="result-img"
                        src={img.src}
                        alt="Generated"
                      />
                      <button
                        className="download-btn"
                        onClick={() => downloadImage(img.src, img.id)}
                        title="Download image"
                      >
                        <i className="fa-solid fa-download"></i>
                      </button>
                    </>
                  )}
                </div>
              ))}
            </div>
          </form>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <p>
          Made by Sanjay Singh Kanwasi with{" "}
          <i className="fa-solid fa-heart"></i>
        </p>
      </footer>
    </div>
  );
};

export default HeroSection;
