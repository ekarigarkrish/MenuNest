"use client";

import { useState } from "react";
import { ArrowRight, LogIn } from "lucide-react";
import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";
import Image from "next/image";
import LoginModal from "@/components/auth/LoginModal";
import Button from "@/components/ui/Button";

export default function Home() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  return (
    <Section className="relative min-h-[100vh] flex items-center overflow-hidden !py-0">
      {/* Background Image with Overlays */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/food_hero_bg.png"
          alt="Restaurant Background"
          fill
          className="object-cover object-center"
          priority
        />
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-black/55" />
        {/* Subtle bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      <Container className="relative z-10 w-full flex justify-center">

        <div className="flex flex-col items-center justify-center text-center max-w-4xl mx-auto space-y-8 animate-fade-in-up">

          {/* Headline */}
          <h1 className="font-heading text-center text-4xl sm:text-5xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.15] lg:leading-[1.1]">
            Transform Restaurant Operations
            <br className="hidden sm:block" />
            with{" "}
            <span
              style={{
                background: "linear-gradient(90deg, #fb6304, #fdb035)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Smart QR Ordering
            </span>
          </h1>

          {/* Supporting Text */}
          <p className="text-base sm:text-lg lg:text-xl text-white/70 max-w-2xl leading-relaxed">
            Enable customers to scan QR codes, browse menus, and place orders —
            while you streamline every restaurant operation from one platform.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto pt-2">
            <Button
              id="get-started-btn"
              onClick={() => setIsLoginModalOpen(true)}
              variant="primary"
              size="lg"
              rightIcon={<ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />}
              className="group w-full sm:w-auto shadow-lg shadow-cayenne-red-500/30"
            >
              Get Started
            </Button>
            
          </div>

        </div>
      </Container>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </Section>
  );
}