// import * as faceapi from 'face-api.js';
// import * as canvas from 'canvas';
// import fetch from 'node-fetch';

// const { Canvas, Image, ImageData } = canvas;
// faceapi.env.monkeyPatch({
//   Canvas: Canvas as any,
//   Image: Image as any,
//   ImageData: ImageData as any,
//   fetch: fetch as any,
// });

// export async function loadModels() {
//   const MODEL_URL = './models';
//   await faceapi.nets.ssdMobilenetv1.loadFromDisk(MODEL_URL);
//   await faceapi.nets.faceRecognitionNet.loadFromDisk(MODEL_URL);
//   await faceapi.nets.faceLandmark68Net.loadFromDisk(MODEL_URL);
// }

// async function getDescriptorFromImageUrl(
//   url: string,
// ): Promise<Float32Array | null> {
//   try {
//     const img = await canvas.loadImage(url);
//     const detection = await faceapi
//       .detectSingleFace(img as any)
//       .withFaceLandmarks()
//       .withFaceDescriptor();

//     return detection?.descriptor || null;
//   } catch (e) {
//     console.error(`Error loading image: ${url}`, e);
//     return null;
//   }
// }

// export async function findMatchingImage(
//   referenceImageUrl: string,
//   candidates: string[],
//   threshold = 0.6,
// ): Promise<string | null> {
//   console.log('called');

//   const referenceDescriptor =
//     await getDescriptorFromImageUrl(referenceImageUrl);
//   if (!referenceDescriptor)
//     throw new Error('No face found in reference image.');

//   for (const url of candidates) {
//     const descriptor = await getDescriptorFromImageUrl(url);
//     if (!descriptor) continue;

//     const distance = faceapi.euclideanDistance(referenceDescriptor, descriptor);
//     console.log(`Compared with ${url}: distance=${distance}`);

//     if (distance < threshold) {
//       return url; // Match found
//     }
//   }

//   return null; // No match
// }
