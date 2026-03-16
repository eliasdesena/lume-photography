"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { fadeUp, staggerContainer, viewportConfig } from "@/lib/motion";
import SectionLabel from "@/components/ui/SectionLabel";
import Placeholder from "@/components/ui/Placeholder";
import { course } from "@/config/course";

function InstructorPhoto() {
  // Drop your photo at /public/images/instructor.jpg to replace the placeholder
  const [showPlaceholder, setShowPlaceholder] = useState(false);

  if (showPlaceholder) {
    return (
      <Placeholder
        label="INSTRUCTOR_PHOTO"
        dimensions="600 × 800px"
        aspectRatio="3/4"
        className="w-full rounded-sm"
        alt={course.instructorPhotoAlt}
      />
    );
  }

  return (
    <div className="relative aspect-[3/4] w-full rounded-sm overflow-hidden">
      <Image
        src="/images/elias.webp"
        alt={course.instructorPhotoAlt}
        fill
        className="object-cover"
        onError={() => setShowPlaceholder(true)}
      />
    </div>
  );
}

export default function Instructor() {
  return (
    <section className="pt-28 sm:pt-36 pb-20 sm:pb-28 px-6">
      <motion.div
        className="max-w-content mx-auto lg:flex lg:gap-20 lg:items-center"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
      >
        {/* Portrait — replace instructor.jpg with your photo in /public/images/ */}
        <motion.div variants={fadeUp} className="lg:w-[40%] mb-12 lg:mb-0">
          <InstructorPhoto />
        </motion.div>

        {/* Bio */}
        <motion.div variants={fadeUp} className="lg:w-[60%]">
          <SectionLabel>Your instructor</SectionLabel>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl mb-6 leading-tight">
            Hi, I&apos;m{" "}
            <span className="text-gold">{course.instructorName}.</span>
          </h2>
          <p className="font-body font-light text-muted text-base leading-relaxed mb-8 max-w-md">
            {course.instructorBio}
          </p>

          {/* Stats */}
          <div className="flex items-baseline gap-10 mb-8">
            <div>
              <p className="font-display text-4xl sm:text-5xl text-cream">
                {course.studentCount}
              </p>
              <p className="text-[10px] text-muted/60 font-body uppercase tracking-[0.08em] mt-1">Students</p>
            </div>
            <div className="w-px h-10 bg-hairline" />
            <div>
              <p className="font-display text-4xl sm:text-5xl text-cream">
                {course.fiveStarCount}
              </p>
              <p className="text-[10px] text-muted/60 font-body uppercase tracking-[0.08em] mt-1">Five-star reviews</p>
            </div>
          </div>

          <a
            href={`https://instagram.com/${course.instagramHandle}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-muted hover:text-gold transition-colors font-body group"
          >
            @{course.instagramHandle}
            <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">→</span>
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
