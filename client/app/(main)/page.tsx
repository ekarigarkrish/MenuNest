"use client";

import { useState } from "react";
import { ArrowRight, QrCode, Zap, BarChart3, Bell, ChefHat, Users } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";
import Image from "next/image";
import LoginModal from "@/components/auth/LoginModal";
import Button from "@/components/ui/Button";

export default function Home() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -150]);

  const features = [
    {
      title: "Smart QR Menus",
      description: "Allow your customers to scan, browse, and order instantly without waiting for a waiter.",
      icon: <QrCode className="w-8 h-8 text-cayenne-red-500" />
    },
    {
      title: "Lightning Fast",
      description: "Orders are beamed straight to the kitchen display in real-time, reducing errors and wait times.",
      icon: <Zap className="w-8 h-8 text-orange-500" />
    },
    {
      title: "Live Analytics",
      description: "Track your top selling dishes and revenue streams with an intuitive real-time dashboard.",
      icon: <BarChart3 className="w-8 h-8 text-cayenne-red-500" />
    },
    {
      title: "Instant Alerts",
      description: "Get alerted immediately for new orders, payments, and customer requests.",
      icon: <Bell className="w-8 h-8 text-orange-500" />
    }
  ];

  return (
    <main className="min-h-screen bg-carbon-black-50 dark:bg-carbon-black-950">
      {/* Hero Section */}
      <Section className="relative min-h-[100vh] flex items-center overflow-hidden !py-0">
        <motion.div style={{ y: y1 }} className="absolute inset-0 z-0">
          <Image
            src="/images/food_hero_bg.png"
            alt="Restaurant Background"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-black/60" />
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-carbon-black-50 dark:from-carbon-black-950 to-transparent" />
        </motion.div>

        <Container className="relative z-10 w-full flex justify-center">
          <div className="flex flex-col items-center justify-center text-center max-w-4xl mx-auto space-y-8 pt-20">
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="font-heading text-center text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.15] lg:leading-[1.1]"
            >
              Transform Restaurant Operations
              <br className="hidden sm:block" />
              with{" "}
              <span className="bg-gradient-to-r from-cayenne-red-500 to-orange-400 bg-clip-text text-transparent">
                Smart QR Ordering
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="text-lg sm:text-xl lg:text-2xl text-white/80 max-w-2xl leading-relaxed"
            >
              Enable customers to scan QR codes, browse menus, and place orders —
              while you streamline every restaurant operation from one platform.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto pt-6"
            >
              <Button
                id="get-started-btn"
                onClick={() => setIsLoginModalOpen(true)}
                variant="primary"
                size="lg"
                rightIcon={<ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />}
                className="group w-full sm:w-auto shadow-xl shadow-cayenne-red-500/30 text-lg px-10 py-6"
              >
                Get Started
              </Button>
            </motion.div>
          </div>
        </Container>
      </Section>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </main>
  );
}