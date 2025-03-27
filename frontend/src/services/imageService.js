const HUGGING_FACE_API_KEY = import.meta.env.VITE_HUGGING_FACE_API_KEY;
const API_URL =
  "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0";

export const generateImages = async (prompt, count) => {
  try {
    // Generate multiple images by making separate API calls
    const imagePromises = Array(count)
      .fill()
      .map(async () => {
        const response = await fetch(API_URL, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${HUGGING_FACE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            inputs: prompt,
            options: {
              wait_for_model: true,
              use_cache: false,
            },
            parameters: {
              num_images_per_prompt: 1, // Generate one image per call
              num_inference_steps: 50,
              guidance_scale: 7.5,
              width: 512,
              height: 512,
              negative_prompt: "blurry, bad quality, distorted, deformed",
              scheduler: "DPMSolverMultistep",
            },
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error || `API call failed: ${response.statusText}`
          );
        }

        // Get the blob data
        const blob = await response.blob();

        // Convert blob to base64
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve(reader.result);
          };
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      });

    // Wait for all images to be generated
    const images = await Promise.all(imagePromises);
    return images;
  } catch (error) {
    console.error("Error generating images:", error);
    throw error;
  }
};
