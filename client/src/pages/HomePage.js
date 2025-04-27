import React from "react";
import HeroSection from "../components/HeroSection";
import CTABanner from "../components/CTABanner";
import CarouselListings from "../components/CarouselListings";
import CoachReview from "../components/CoachReview";
import InformationSection from "../components/InformationSection";
import BlogSection from '../components/BlogSection';
import NewsletterSection from "../components/NewsletterSection";

const HomePage = () => {
  return (
    <div>
      <InformationSection />
      <CTABanner />
      <div className="mt-5 mb-2">
        <CarouselListings />
      </div>
      <CoachReview />
      <BlogSection />
      <NewsletterSection/>
    </div>
  );
};

export default HomePage;
