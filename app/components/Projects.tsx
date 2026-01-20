// app/components/Projects.tsx
"use client";

const projects = [
  {
    name: "CarbonSetu",
    tech: "MongoDB · JavaScript · Python · React.js · AWS",
    tagline: "Carbon credits, made visible",
    github: "https://github.com/your-user/carbonsetu",
    live: "https://carbonsetu-demo.vercel.app",
  },
  {
    name: "TVIC",
    tech: "Python · JavaScript · AWS · Next.js · Cloudinary",
    tagline: "Trust your integrated circuits",
    github: "https://github.com/your-user/tvic",
    live: "https://tvic-demo.vercel.app",
  },
  {
    name: "Laksh Closet",
    tech: "React.js · Cloudinary · Node.js · Cashfree",
    tagline: "Streetwear, shipped fast",
    github: "https://github.com/your-user/laksh-closet",
    live: "https://laksh-closet-demo.vercel.app",
  },
];

export default function Projects() {
  return (
    <section
      id="projects"
      className="w-full bg-[#10140d] px-0 py-12 sm:py-16 md:py-20"
    >
      <div className="mx-auto w-full max-w-none px-4 sm:px-6 md:px-8">
        {/* Heading */}
        <h2
          className="
            mb-8 text-left
            text-[32px] sm:text-[40px] md:text-[48px]
            font-bank uppercase tracking-[0.28em]
            text-[#e3ff6b]
          "
        >
          Projects
        </h2>

        <div className="space-y-4 sm:space-y-5">
          {projects.map((p) => (
            <article
              key={p.name}
              className="
                group relative overflow-hidden
                border border-[#283319]
                bg-[#0b0f09]
                px-4 py-4
                sm:px-5 sm:py-5
                md:px-6 md:py-6
                transition-colors duration-500
                hover:border-[#e3ff6b]/70 hover:bg-[#11180e]
              "
            >
              {/* subtle neon bar */}
              <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-[#e3ff6b]/0 via-[#e3ff6b]/60 to-[#e3ff6b]/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              <div
                className="
                  flex flex-col gap-3
                  sm:flex-row sm:items-center sm:justify-between
                "
              >
                {/* Left: tech + name */}
                <div className="flex-1">
                  {/* Tech line */}
                  <p
                    className="
                      text-[10px] sm:text-[11px] md:text-[12px]
                      font-bank uppercase tracking-[0.26em]
                      text-[#9fb68b]
                      flex flex-wrap items-center gap-1
                    "
                  >
                    <span className="mr-2 text-[#e3ff6b]">◎</span>
                    {p.tech}
                  </p>

                  {/* Name + tagline */}
                  <div className="mt-1 flex flex-col sm:flex-row sm:items-baseline sm:gap-3">
                    <h3
                      className="
                        text-[18px] sm:text-[20px] md:text-[22px]
                        font-bank uppercase tracking-[0.22em]
                        text-[#f5f5f0]
                      "
                    >
                      {p.name}
                    </h3>
                    <p
                      className="
                        text-[11px] sm:text-[12px]
                        font-bank tracking-[0.18em]
                        text-[#a7b693]
                      "
                    >
                      {p.tagline}
                    </p>
                  </div>
                </div>

                {/* Right: buttons */}
                <div
                  className="
                    mt-3 flex shrink-0 flex-wrap items-center
                    gap-2 sm:mt-0 sm:justify-end
                  "
                >
                  <a
                    href={p.github}
                    target="_blank"
                    rel="noreferrer"
                    className="
                      rounded-full border border-[#e3ff6b]
                      bg-transparent px-4 py-2
                      text-[10px] sm:text-[11px]
                      font-bank uppercase tracking-[0.22em]
                      text-[#e3ff6b]
                      transition-colors duration-300
                      hover:bg-[#e3ff6b] hover:text-[#11140b]
                    "
                  >
                    GitHub
                  </a>
                  <a
                    href={p.live}
                    target="_blank"
                    rel="noreferrer"
                    className="
                      rounded-full bg-[#e3ff6b]
                      px-4 py-2
                      text-[10px] sm:text-[11px]
                      font-bank uppercase tracking-[0.22em]
                      text-[#11140b]
                      transition-transform duration-300
                      hover:-translate-y-[1px] hover:bg-[#f2ff85]
                    "
                  >
                    Live demo
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
