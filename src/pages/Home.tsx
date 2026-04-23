import { Helmet } from "react-helmet-async";
import { Hero } from "../components/sections/Hero";
import { Features } from "../components/sections/Features";
import { About } from "../components/sections/About";
import { Pricing } from "../components/sections/Pricing";
import { Services } from "../components/sections/Services";
import { Process } from "../components/sections/Process";
import { Reviews } from "../components/sections/Reviews";
import { Faqs } from "../components/sections/Faqs";

export const Home = () => {
  return (
    <div className="flex flex-col">
      {/* Hero Card */}
      <div className="px-1 md:px-1.5 pt-1 md:pt-1.5">
        <div className="rounded-[12px] md:rounded-[22px] overflow-hidden shadow-md relative ring-1 ring-black/[0.05] bg-white">
          <Hero />
        </div>
      </div>

      <Features />

      {/* Process Card */}
      <div className="px-1 md:px-1.5 py-1 md:py-1.5">
        <div className="rounded-[12px] md:rounded-[22px] overflow-hidden shadow-md relative ring-1 ring-black/[0.05] bg-white">
          <Process />
        </div>
      </div>

      <Pricing />

      {/* Services Card */}
      <div className="px-1 md:px-1.5 py-1 md:py-1.5">
        <div className="rounded-[12px] md:rounded-[22px] overflow-hidden shadow-md relative ring-1 ring-black/[0.05] bg-white">
          <Services />
        </div>
      </div>

      <About />
      
      {/* Reviews Card */}
      <div className="px-1 md:px-1.5 py-1 md:py-1.5">
        <div className="rounded-[12px] md:rounded-[22px] overflow-hidden shadow-md relative ring-1 ring-black/[0.05] bg-[#1e252a]">
          <Reviews />
        </div>
      </div>

      <Faqs />
    </div>
  );
};
e="rounded-[12px] md:rounded-[22px] overflow-hidden shadow-md relative ring-1 ring-black/[0.05] bg-white">
          <Services />
        </div>
      </div>

      <About />
      
      {/* Reviews Card */}
      <div className="px-1 md:px-1.5 py-1 md:py-1.5">
        <div className="rounded-[12px] md:rounded-[22px] overflow-hidden shadow-md relative ring-1 ring-black/[0.05] bg-[#1e252a]">
          <Reviews />
        </div>
      </div>

      <Faqs />
    </div>
  );
};
