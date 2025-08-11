import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as faceapi from 'face-api.js';
import * as canvas from 'canvas';
import * as path from 'path';
import { PrismaService } from 'prisma/prisma.service';

// Configure face-api.js for Node.js environment
const { Canvas, Image, ImageData, loadImage } = canvas;
faceapi.env.monkeyPatch({
  Canvas: Canvas as any,
  Image: Image as any,
  ImageData: ImageData as any,
  fetch: fetch as any,
});

@Injectable()
export class FacialRecognitionService {
  private modelsLoaded = false;

  constructor(private readonly prismaService: PrismaService) {}

  async onModuleInit() {
    try {
      await this.loadModels();
    } catch (error) {
      console.error('Failed to initialize face recognition:', error);
    }
  }

  private async loadModels() {
    if (this.modelsLoaded) return;

    const MODEL_URL = path.join(__dirname, 'models');

    await Promise.all([
      faceapi.nets.ssdMobilenetv1.loadFromDisk(MODEL_URL),
      faceapi.nets.faceRecognitionNet.loadFromDisk(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromDisk(MODEL_URL),
    ]);

    this.modelsLoaded = true;
  }

  async identify(file: Express.Multer.File) {
    if (!this.modelsLoaded) {
      throw new InternalServerErrorException(
        'Face recognition models not loaded',
      );
    }

    const result = await this.extractDescriptor(file.buffer);

    console.log(result);
  }

  async extractDescriptor(imageBuffer: Buffer): Promise<number[] | void> {
    if (!this.modelsLoaded) {
      await this.loadModels();
    }

    const img = await loadImage(imageBuffer);

    const detection = await faceapi
      .detectSingleFace(img as any)
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detection) {
      return;
    }

    return Array.from(detection.descriptor);
  }
}
