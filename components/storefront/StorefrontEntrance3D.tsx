"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import Image from "next/image";
import { Sparkles, ArrowLeft, ShieldCheck, Truck, Zap } from "lucide-react";
import { withBasePath } from "../../lib/site";

interface StorefrontEntrance3DProps {
  onEnter: () => void;
}

export default function StorefrontEntrance3D({ onEnter }: StorefrontEntrance3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isEntering, setIsEntering] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [whiteOverlayOpacity, setWhiteOverlayOpacity] = useState(0);

  const onEnterRef = useRef(onEnter);
  onEnterRef.current = onEnter;

  // Animation synchronization refs
  const isEnteringRef = useRef(false);
  const enterStartTimeRef = useRef(0);
  const hasFinishedRef = useRef(false);

  const handleStartEntering = useCallback(() => {
    if (isEnteringRef.current || hasFinishedRef.current) return;
    isEnteringRef.current = true;
    enterStartTimeRef.current = performance.now();
    setIsEntering(true);
  }, []);

  const handleSkip = useCallback(() => {
    if (hasFinishedRef.current) return;
    hasFinishedRef.current = true;
    setWhiteOverlayOpacity(1);
    setTimeout(() => {
      onEnterRef.current();
    }, 150);
  }, []);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Safety timer: ensures loading spinner clears quickly on any connection
    const safetyTimer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;
    const isMobile = width < 768 || width < height;

    // Scene & Camera setup
    const scene = new THREE.Scene();
    scene.background = null;
    let imageFrame: THREE.LineSegments | null = null;

    // Storefront plane geometry: 16:9 ratio
    const planeH = 6.0;
    const planeW = planeH * (16.0 / 9.0); // 10.667

    // Preserve the full image on portrait screens. A blurred, full-screen copy
    // behind it fills the tall phone viewport without cropping the facade.
    const FOV = 45;
    const halfTan = Math.tan(((FOV / 2) * Math.PI) / 180);

    const getCamZ = (w: number, h: number) => {
      const aspect = Math.max(w / h, 0.01);
      const fitHeight = planeH / (2 * halfTan);
      const fitWidth = planeW / (2 * halfTan * aspect);
      if (aspect < 1) return fitWidth * 1.08;

      const fitHeightWithMargin = fitHeight * 1.08;
      const fitWidthWithMargin = fitWidth * 1.08;
      return Math.max(fitHeightWithMargin, fitWidthWithMargin);
    };

    let initialCamZ = getCamZ(width, height);
    let initialCamY = isMobile ? -0.2 : 0.0;

    const camera = new THREE.PerspectiveCamera(FOV, width / height, 0.1, 100);
    camera.position.set(0, initialCamY, initialCamZ);
    camera.lookAt(0, initialCamY, 0);

    // Renderer creation with fallback
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "default",
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2.0));
      renderer.setClearColor(0x0a1015, 0);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.12;
      container.appendChild(renderer.domElement);
    } catch (e) {
      console.warn("WebGL init fallback:", e);
      setIsLoading(false);
      return;
    }

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.9);
    dirLight.position.set(0, 4.0, 5.0);
    scene.add(dirLight);

    // Turquoise brand glow above the entrance sign
    const signLight = new THREE.PointLight(0x00c2cb, 2.8, 10);
    signLight.position.set(0, 1.8, 0.6);
    scene.add(signLight);

    // 1. Crystal-Clear Backdrop Plane
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      withBasePath("/storefront-enhanced-2k.jpg"),
      (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.generateMipmaps = true;
        texture.minFilter = THREE.LinearMipmapLinearFilter;
        texture.magFilter = THREE.LinearFilter;
        try {
          texture.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 8);
        } catch (_) {}

        const planeGeo = new THREE.PlaneGeometry(planeW, planeH);
        const planeMat = new THREE.MeshBasicMaterial({
          map: texture,
          side: THREE.FrontSide,
        });
        const backdropMesh = new THREE.Mesh(planeGeo, planeMat);
        backdropMesh.position.set(0, 0, -0.05);
        scene.add(backdropMesh);

        const frameGeometry = new THREE.EdgesGeometry(planeGeo);
        const frameMaterial = new THREE.LineBasicMaterial({
          color: 0x8df7fb,
          transparent: true,
          opacity: 0.8,
        });
        imageFrame = new THREE.LineSegments(frameGeometry, frameMaterial);
        imageFrame.position.set(0, 0, -0.025);
        imageFrame.visible = width < height;
        scene.add(imageFrame);
        setIsLoading(false);
      },
      undefined,
      () => {
        setIsLoading(false);
      }
    );

    // 2. Real 3D Sliding Glass Doors precisely over the doorway
    // Doorway coordinates (16:9 image):
    // Left: x = -1.333, Right: x = +1.333, Width = 2.667
    // Top: y = +1.28, Bottom: y = -2.40, Height = 3.68, Center Y = -0.56
    const doorCenterY = -0.56;
    const doorH = 3.68;
    const doorPaneW = 1.33;

    // Procedural glass reflection texture
    const glassCanvas = document.createElement("canvas");
    glassCanvas.width = 256;
    glassCanvas.height = 512;
    const gCtx = glassCanvas.getContext("2d");
    if (gCtx) {
      const grad = gCtx.createLinearGradient(0, 0, 256, 512);
      grad.addColorStop(0, "rgba(255, 255, 255, 0.28)");
      grad.addColorStop(0.35, "rgba(0, 194, 203, 0.16)");
      grad.addColorStop(0.7, "rgba(255, 255, 255, 0.08)");
      grad.addColorStop(1, "rgba(0, 194, 203, 0.22)");
      gCtx.fillStyle = grad;
      gCtx.fillRect(0, 0, 256, 512);

      gCtx.strokeStyle = "rgba(255, 255, 255, 0.4)";
      gCtx.lineWidth = 2.5;
      gCtx.beginPath();
      gCtx.moveTo(40, 0);
      gCtx.lineTo(160, 512);
      gCtx.stroke();
    }
    const glassTex = new THREE.CanvasTexture(glassCanvas);

    // PBR Glass Material
    const glassMat = new THREE.MeshPhysicalMaterial({
      map: glassTex,
      transparent: true,
      opacity: 0.45,
      roughness: 0.05,
      metalness: 0.1,
      transmission: 0.72,
      ior: 1.5,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
    });

    const frameMat = new THREE.MeshStandardMaterial({
      color: 0xdde2e7,
      metalness: 0.92,
      roughness: 0.18,
    });

    const chromeMat = new THREE.MeshStandardMaterial({
      color: 0xf5f7fa,
      metalness: 0.98,
      roughness: 0.05,
    });

    const doorGroup = new THREE.Group();
    scene.add(doorGroup);

    // Overhead Stainless Steel Guide Track
    const topTrackGeo = new THREE.BoxGeometry(2.78, 0.05, 0.08);
    const topTrack = new THREE.Mesh(topTrackGeo, frameMat);
    topTrack.position.set(0, doorCenterY + doorH / 2 + 0.025, 0.03);
    doorGroup.add(topTrack);

    // Floor Guide Track
    const bottomTrackGeo = new THREE.BoxGeometry(2.78, 0.03, 0.08);
    const bottomTrack = new THREE.Mesh(bottomTrackGeo, frameMat);
    bottomTrack.position.set(0, doorCenterY - doorH / 2 - 0.015, 0.03);
    doorGroup.add(bottomTrack);

    const fThick = 0.035;
    const doorGeo = new THREE.PlaneGeometry(doorPaneW, doorH);

    // Left Door Assembly
    const leftDoor = new THREE.Group();
    const leftPane = new THREE.Mesh(doorGeo, glassMat);
    leftDoor.add(leftPane);

    const fTop = new THREE.Mesh(new THREE.BoxGeometry(doorPaneW, fThick, 0.05), frameMat);
    fTop.position.set(0, doorH / 2, 0.01);
    const fBottom = new THREE.Mesh(new THREE.BoxGeometry(doorPaneW, fThick, 0.05), frameMat);
    fBottom.position.set(0, -doorH / 2, 0.01);
    const fLeft = new THREE.Mesh(new THREE.BoxGeometry(fThick, doorH, 0.05), frameMat);
    fLeft.position.set(-doorPaneW / 2, 0, 0.01);
    const fRight = new THREE.Mesh(new THREE.BoxGeometry(fThick, doorH, 0.05), frameMat);
    fRight.position.set(doorPaneW / 2, 0, 0.01);
    leftDoor.add(fTop, fBottom, fLeft, fRight);

    // Chrome Tubular Vertical Handle
    const handleGeo = new THREE.CylinderGeometry(0.016, 0.016, 1.3, 16);
    const leftHandle = new THREE.Mesh(handleGeo, chromeMat);
    leftHandle.position.set(doorPaneW / 2 - 0.08, -0.05, 0.05);
    leftDoor.add(leftHandle);

    const initialLeftX = -doorPaneW / 2;
    leftDoor.position.set(initialLeftX, doorCenterY, 0.02);
    doorGroup.add(leftDoor);

    // Right Door Assembly
    const rightDoor = new THREE.Group();
    const rightPane = new THREE.Mesh(doorGeo, glassMat);
    rightDoor.add(rightPane);

    const rfTop = new THREE.Mesh(new THREE.BoxGeometry(doorPaneW, fThick, 0.05), frameMat);
    rfTop.position.set(0, doorH / 2, 0.01);
    const rfBottom = new THREE.Mesh(new THREE.BoxGeometry(doorPaneW, fThick, 0.05), frameMat);
    rfBottom.position.set(0, -doorH / 2, 0.01);
    const rfLeft = new THREE.Mesh(new THREE.BoxGeometry(fThick, doorH, 0.05), frameMat);
    rfLeft.position.set(-doorPaneW / 2, 0, 0.01);
    const rfRight = new THREE.Mesh(new THREE.BoxGeometry(fThick, doorH, 0.05), frameMat);
    rfRight.position.set(doorPaneW / 2, 0, 0.01);
    rightDoor.add(rfTop, rfBottom, rfLeft, rfRight);

    // Right Door Handle
    const rightHandle = new THREE.Mesh(handleGeo, chromeMat);
    rightHandle.position.set(-doorPaneW / 2 + 0.08, -0.05, 0.05);
    rightDoor.add(rightHandle);

    const initialRightX = doorPaneW / 2;
    rightDoor.position.set(initialRightX, doorCenterY, 0.02);
    doorGroup.add(rightDoor);

    // Animation constants
    let animationFrameId: number;
    const TOTAL_DURATION_MS = 1150; // Fast 1.15s cinematic sequence
    const DOOR_SLIDE_DISTANCE = 1.4; // Slide distance clearing doorway

    const animate = (currentTime: number) => {
      animationFrameId = requestAnimationFrame(animate);

      if (!isEnteringRef.current) {
        // Idle gentle breathing motion
        const floatZ = Math.sin(currentTime * 0.001) * 0.02;
        const floatY = Math.cos(currentTime * 0.0008) * 0.01;
        camera.position.z = initialCamZ + floatZ;
        camera.position.y = initialCamY + floatY;
        signLight.intensity = 2.8 + Math.sin(currentTime * 0.003) * 0.35;
      } else {
        // Entering transition in progress
        const elapsed = currentTime - enterStartTimeRef.current;
        const rawProgress = Math.min(elapsed / TOTAL_DURATION_MS, 1.0);

        // Smooth cubic ease out for door opening
        const doorEase = 1 - Math.pow(1 - rawProgress, 3);

        // Slide the 3D doors horizontally away from center
        leftDoor.position.x = initialLeftX - DOOR_SLIDE_DISTANCE * doorEase;
        rightDoor.position.x = initialRightX + DOOR_SLIDE_DISTANCE * doorEase;

        // Smooth ease-in-out camera dolly-in straight through the entrance
        const camEase =
          rawProgress < 0.5
            ? 2 * rawProgress * rawProgress
            : 1 - Math.pow(-2 * rawProgress + 2, 2) / 2;

        camera.position.z = THREE.MathUtils.lerp(initialCamZ, -1.8, camEase);
        camera.position.y = THREE.MathUtils.lerp(initialCamY, doorCenterY + 0.1, camEase);

        // White fade out ramps up over final 35% of the fly-in
        if (rawProgress >= 0.65) {
          const fadeProgress = (rawProgress - 0.65) / 0.35;
          setWhiteOverlayOpacity(Math.min(fadeProgress, 1));
        }

        // Completion trigger
        if (rawProgress >= 1.0 && !hasFinishedRef.current) {
          hasFinishedRef.current = true;
          onEnterRef.current();
          return;
        }
      }

      renderer.render(scene, camera);
    };

    animationFrameId = requestAnimationFrame(animate);

    // Reframe the entire facade when the screen is resized or rotated.
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth || window.innerWidth;
      const newH = container.clientHeight || window.innerHeight;
      const mobileNow = newW < 768 || newW < newH;
      camera.aspect = newW / newH;
      initialCamZ = getCamZ(newW, newH);
      initialCamY = mobileNow ? -0.2 : 0.0;
      if (imageFrame) imageFrame.visible = newW < newH;
      if (!isEnteringRef.current) {
        camera.position.z = initialCamZ;
        camera.position.y = initialCamY;
      }
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);
    window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(safetyTimer);
      resizeObserver.disconnect();
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      if (imageFrame) {
        imageFrame.geometry.dispose();
        (imageFrame.material as THREE.Material).dispose();
      }
      glassTex.dispose();
      glassMat.dispose();
      frameMat.dispose();
      chromeMat.dispose();
      doorGeo.dispose();
      topTrackGeo.dispose();
      bottomTrackGeo.dispose();
      handleGeo.dispose();
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 h-[100dvh] overflow-hidden bg-slate-950 font-sans select-none"
      style={{ backgroundImage: `url("${withBasePath("/storefront-enhanced-2k.jpg")}")`, backgroundPosition: "center", backgroundSize: "cover" }}
      dir="rtl"
    >
      <div
        className="pointer-events-none absolute inset-[-24px] scale-110 bg-cover bg-center opacity-80 blur-2xl"
        style={{ backgroundImage: `url("${withBasePath("/storefront-enhanced-2k.jpg")}")` }}
      />
      <div className="pointer-events-none absolute inset-0 bg-slate-950/35" />
      {/* 3D Canvas Mount - clicking anywhere triggers entrance */}
      <div
        ref={mountRef}
        className="absolute inset-0 z-[1] h-full w-full cursor-pointer"
        onClick={handleStartEntering}
      />

      {/* Subtle vignette gradient */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-slate-950/60" />

      {/* Top Brand Bar */}
      <div className="absolute top-0 left-0 right-0 z-10 px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2.5 sm:gap-3 pointer-events-auto">
          <div className="relative w-11 h-11 sm:w-14 sm:h-14 rounded-2xl overflow-hidden border border-cyan-400/30 shadow-[0_0_20px_rgba(0,194,203,0.35)] bg-slate-900/80 backdrop-blur-md p-1">
            <Image
              src={withBasePath("/logo.jpg")}
              alt="Dubai Store Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div>
            <h1 className="text-base sm:text-xl font-black text-white tracking-wide flex items-center gap-1.5 sm:gap-2">
              <span>دبي ستور</span>
              <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded-full bg-[#00C2CB]/20 text-[#00C2CB] border border-[#00C2CB]/40">
                المحل الأصلي
              </span>
            </h1>
            <p className="text-[10px] sm:text-xs text-slate-300">موبايلات وإكسسوارات أصلية معتمدة</p>
          </div>
        </div>

        {/* Skip button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleSkip();
          }}
          className="pointer-events-auto group flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-[11px] sm:text-xs font-semibold backdrop-blur-md border border-white/20 transition-all duration-200 active:scale-95 shadow-sm"
        >
          <span>تخطي والدخول</span>
          <ArrowLeft className="w-3 h-3 sm:w-3.5 sm:h-3.5 group-hover:-translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Interactive Welcoming Overlay */}
      {!isEntering && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-end pb-6 sm:pb-12 px-4 pointer-events-none">
          <div className="max-w-lg w-full text-center space-y-3 sm:space-y-4 pointer-events-auto">
            {/* Illuminated Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900/85 border border-[#00C2CB]/50 backdrop-blur-xl shadow-[0_0_20px_rgba(0,194,203,0.3)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00C2CB] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00C2CB]"></span>
              </span>
              <span className="text-[11px] sm:text-xs font-bold text-white tracking-wide">
                واجهة المحل التفاعلية 3D
              </span>
            </div>

            {/* Welcoming Headline */}
            <div className="space-y-0.5 sm:space-y-1">
              <h2 className="text-xl sm:text-3xl md:text-4xl font-black text-white drop-shadow-md">
                أهلاً بيك في <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00C2CB] via-cyan-300 to-white">دبي ستور</span>
              </h2>
              <p className="text-[11px] sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                ادخل وشوف أحدث أجهزة الآيفون، سامسونج، وأرقى الإكسسوارات الأصلية
              </p>
            </div>

            {/* Main Action Button */}
            <div className="pt-1 flex flex-col items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleStartEntering();
                }}
                className="group relative inline-flex items-center justify-center gap-2.5 sm:gap-3 px-7 sm:px-10 py-3 sm:py-4 rounded-2xl bg-gradient-to-r from-[#00C2CB] to-teal-400 text-slate-950 font-black text-sm sm:text-lg shadow-[0_0_30px_rgba(0,194,203,0.5)] hover:shadow-[0_0_45px_rgba(0,194,203,0.8)] hover:scale-105 active:scale-95 transition-all duration-300 border border-cyan-200/50 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-slate-950" />
                <span>ادخل المحل الآن</span>
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-slate-950 group-hover:-translate-x-1.5 transition-transform" />
              </button>

              <p className="text-[10px] sm:text-[11px] text-slate-400">
                المس الشاشة لفتح الأبواب والدخول فوراً
              </p>
            </div>

            {/* Trust Badges */}
            <div className="pt-1 flex items-center justify-center gap-2.5 sm:gap-5 text-[10px] sm:text-xs text-slate-300">
              <div className="flex items-center gap-1 bg-slate-900/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10">
                <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#00C2CB]" />
                <span>ضمان معتمد</span>
              </div>
              <div className="flex items-center gap-1 bg-slate-900/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10">
                <Truck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#00C2CB]" />
                <span>شحن سريع</span>
              </div>
              <div className="flex items-center gap-1 bg-slate-900/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10">
                <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#00C2CB]" />
                <span>أصلي 100%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Entering status indicator */}
      {isEntering && (
        <div className="absolute bottom-8 left-0 right-0 z-20 flex justify-center pointer-events-none">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/90 border border-[#00C2CB]/50 text-white text-xs font-semibold backdrop-blur-xl shadow-lg">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00C2CB] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00C2CB]"></span>
            </span>
            <span>جاري فتح الأبواب والدخول...</span>
          </div>
        </div>
      )}

      {/* Loading state spinner */}
      {isLoading && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-slate-950/90 backdrop-blur-md">
          <div className="w-10 h-10 rounded-full border-4 border-[#00C2CB]/20 border-t-[#00C2CB] animate-spin mb-3" />
          <p className="text-white text-xs font-semibold">جاري تحضير المحل...</p>
        </div>
      )}

      {/* Smooth White Transition Overlay */}
      <div
        className="pointer-events-none absolute inset-0 bg-white transition-opacity duration-300 z-40"
        style={{ opacity: whiteOverlayOpacity }}
      />
    </div>
  );
}
