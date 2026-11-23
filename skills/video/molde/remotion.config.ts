import { Config } from "@remotion/cli/config";

Config.setEntryPoint("src/index.ts");
Config.setVideoImageFormat("jpeg");
Config.setJpegQuality(92);
Config.setCodec("h264");
Config.setCrf(18);
Config.setPixelFormat("yuv420p");
// A VPS tem 6 núcleos e ~3 GB livres: 3 abas do Chrome é o limite seguro.
Config.setConcurrency(3);
